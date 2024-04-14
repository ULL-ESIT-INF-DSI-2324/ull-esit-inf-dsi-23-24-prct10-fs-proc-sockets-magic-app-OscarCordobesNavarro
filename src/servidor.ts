/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 10/04/2024
 * Práctica 10: Modificacion PE101
*/

import net from "net";
import { MessageType } from "./cliente.js";
import { CardCollectionsHandlerAsync } from "./Previo/CardCollectionsHandler.js";
import { ICard } from "./Previo/ICard.js";
import { Color } from "./Previo/IColor.js";
import { Rarity } from "./Previo/IRarity.js";
import { TypeLine } from "./Previo/ITypeLine.js";
import chalk from "chalk";

export interface RequestMessage {
  type: MessageType;
  data: string[];
}

export interface ResponseMessage {
  success: boolean;
  data: string;
}

// Creamos el buffer vacío
const server = net.createServer((socket) => {
  console.log("Cliente conectado" + " " + new Date().toISOString());
  let buffer = Buffer.alloc(0);

  socket.on('data', (data) => {
    buffer = Buffer.concat([buffer, data]);

    while (buffer.length >= 4) {
      const longitud = buffer.readInt32BE(0);

      if (buffer.length >= longitud + 4) {
        const mensajeString = buffer.subarray(4, longitud + 4).toString('utf8');


        messageHandler(mensajeString, (error, response) => {
          let responseMessage: ResponseMessage;
          if (error) {
            // Creamos un mensaje de respuesta para enviar
            responseMessage = {
              success: false,
              data: error.message
            };
          } else if (response) {
            // Creamos un mensaje de respuesta para enviar
            responseMessage = {
              success: true,
              data: response
            };
          } else {
            responseMessage = {
              success: false,
              data: "Error desconocido"
            };
          }
          const respuestaString = JSON.stringify(responseMessage);
          const longitudRespuesta = Buffer.byteLength(respuestaString, 'utf8');
          const bufferRespuesta = Buffer.alloc(4 + longitudRespuesta);
          bufferRespuesta.writeInt32BE(longitudRespuesta, 0);
          bufferRespuesta.write(respuestaString, 4, 'utf8');
          socket.write(bufferRespuesta);
          socket.end();
        });
        // Limpieza del buffer
        buffer = buffer.slice(longitud + 4);
      } else {
        break;
      }
    }
  });

  socket.on("end", () => {
    console.log("Cliente desconectado end a las " + new Date().toISOString());
  });

  socket.on("close", () => {
    console.log("Cliente desconectado close a las " + new Date().toISOString());
  });

  socket.on("error", (error) => {
    console.log("Error: " + error);
  });

}).listen(60300, () => {
  console.log("Escuchando en el puerto 60300");
});


// Funcion asincrona callback que gestiona los mensajes de los clientes
export function messageHandler(msg: string, callback: (error: Error | null, response?: string) => void) {

  const message = JSON.parse(msg) as RequestMessage;

  console.log("MENSAJE PARSEADO EN MESSAGE HANDLER: " + message);

  console.log("Tipo de solicitud ->" + message.type);

  const handler = new CardCollectionsHandlerAsync(message.data[0]);

  const carta: ICard = {
    id: parseInt(message.data[1]),
    name: message.data[2],
    manaCost: parseInt(message.data[3]),
    color: message.data[4] as Color,
    lineType: message.data[5] as TypeLine,
    rarity: message.data[6] as Rarity,
    ruleText: message.data[7],
    strength: parseInt(message.data[8]),
    endurance: parseInt(message.data[9]),
    brandsLoyalty: parseInt(message.data[10]),
    marketValue: parseInt(message.data[11]),
  };

  switch (message.type) {
    case MessageType.ADD:
      handler.addCard(carta, (error) => {
        if (error) {
          callback(error);
          return;
        } else {
          callback(null, chalk.green.bold("Card added successfully"));
        }
      });
      break;
    case MessageType.REMOVE:
      callback(null, "Carta eliminada");
      break;
    case MessageType.READ:
      console.log("ID: " + message.data[1] + " User: " + message.data[0]);
      handler.getStringCard(parseInt(message.data[1]), (error, string) => {
        if (error) {
          callback(error);
          return;
        } else {
          console.log("STRING: " + string);
          callback(null, string);
        }
      });
      break;
    case MessageType.UPDATE:
      callback(null, "Carta actualizada");
      break;
    case MessageType.LIST:
      callback(null, "Cartas listadas");
      break;
    default:
      callback(new Error("Comando no reconocido"));
  }


}
