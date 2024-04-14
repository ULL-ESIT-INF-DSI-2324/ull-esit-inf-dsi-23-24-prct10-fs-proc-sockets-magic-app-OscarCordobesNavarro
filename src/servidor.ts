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
import { MessageType } from "./MessageType.js";
import { CardCollectionsHandlerAsync } from "./Previo/CardCollectionsHandlerAsync.js";
import { ICard } from "./Previo/ICard.js";
import { Color } from "./Previo/IColor.js";
import { Rarity } from "./Previo/IRarity.js";
import { TypeLine } from "./Previo/ITypeLine.js";
import chalk from "chalk";
import { RequestMessage } from "./IRequestMessage.js";
import { ResponseMessage } from "./IResponseMessage.js";

// Creamos el buffer vacío
export const server = net
  .createServer((socket) => {
    console.log("Cliente conectado" + " " + new Date().toISOString());
    let buffer = Buffer.alloc(0);

    socket.on("data", (data) => {
      buffer = Buffer.concat([buffer, data]);

      while (buffer.length >= 4) {
        const longitud = buffer.readInt32BE(0);

        if (buffer.length >= longitud + 4) {
          const mensajeString = buffer
            .subarray(4, longitud + 4)
            .toString("utf8");

          messageHandler(mensajeString, (error, response) => {
            let responseMessage: ResponseMessage;
            if (error) {
              // Creamos un mensaje de respuesta para enviar
              responseMessage = {
                success: false,
                data: error.message,
              };
            } else if (response) {
              // Creamos un mensaje de respuesta para enviar
              responseMessage = {
                success: true,
                data: response,
              };
            } else {
              responseMessage = {
                success: false,
                data: "Error desconocido",
              };
            }
            const respuestaString = JSON.stringify(responseMessage);
            const longitudRespuesta = Buffer.byteLength(
              respuestaString,
              "utf8",
            );
            const bufferRespuesta = Buffer.alloc(4 + longitudRespuesta);
            bufferRespuesta.writeInt32BE(longitudRespuesta, 0);
            bufferRespuesta.write(respuestaString, 4, "utf8");
            socket.write(bufferRespuesta);
            socket.end();
          });
          // Limpieza del buffer
          buffer = buffer.subarray(longitud + 4);
        } else {
          break;
        }
      }
    });

    socket.on("end", () => {
      console.log("Finalizando operacion");
    });

    socket.on("close", () => {
      console.log(
        "Cliente desconectado a las " + new Date().toISOString(),
      );
    });

    socket.on("error", (error) => {
      console.log("Error: " + error);
    });
  })
  .listen(60300, () => {
    console.log("Escuchando en el puerto 60300");
  });

export function messageHandler(
  msg: string,
  callback: (error: Error | null, response?: string) => void,
) {
  const message = JSON.parse(msg) as RequestMessage;

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
      console.log(chalk.yellow("Se ha solicitado añadir una carta por parte del usuario: " + message.data[0]))
      handler.addCard(carta, (error) => {
        if (error) {
          console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
          callback(error);
          return;
        } else {
          console.log(chalk.green.bold("Operacion realizada con exito"));
          callback(null, chalk.green.bold("Card added successfully"));
        }
      });
      break;
    case MessageType.REMOVE:
      console.log(chalk.yellow("Se ha solicitado eliminar una carta por parte del usuario: " + message.data[0]))
      handler.removeCard(parseInt(message.data[1]), (error) => {
        if (error) {
          console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
          callback(error);
          return;
        } else {
          console.log(chalk.green.bold("Operacion realizada con exito"));
          callback(null, chalk.green.bold("Card removed successfully"));
        }
      });
      break;
    case MessageType.READ:
      console.log(chalk.yellow("Se ha solicitado leer una carta por parte del usuario: " + message.data[0]))
      handler.getStringCard(parseInt(message.data[1]), (error, string) => {
        if (error) {
          console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
          callback(error);
          return;
        } else {
          console.log(chalk.green.bold("Operacion realizada con exito"));
          callback(null, string);
        }
      });
      break;
    case MessageType.UPDATE:
      console.log(chalk.yellow("Se ha solicitado actualizar una carta por parte del usuario: " + message.data[0]))
      handler.getCard(parseInt(message.data[1]), (error, card) => {
        if (error) {
          callback(error);
          return;
        } else if (card) {
          if (carta.id != card.id) {
            callback(new Error(chalk.red.bold("Card ID does not match")));
          }
          // Obtenemos el color de la carta
          let newColor: Color = card.color;
          // Si la carta nueva tiene color, lo actualizamos
          if (carta.color) {
            // Comprobamos que el color sea correcto
            if (Object.values(Color).includes(carta.color)) {
              newColor = carta.color;
            } else {
              callback(new Error(chalk.red.bold("Invalid color")));
              return;
            }
          }
          // Obtenemos el tipo de linea de la carta
          let newTypeLine: TypeLine = card.lineType;
          // Si la carta nueva tiene tipo de linea, lo actualizamos
          if (carta.lineType) {
            if (Object.values(TypeLine).includes(carta.lineType)) {
              newTypeLine = carta.lineType;
            } else {
              callback(new Error(chalk.red.bold("Invalid type line")));
              return;
            }
          }
          // Obtenemos la rareza de la carta
          let newRarity: Rarity = card.rarity;
          // Si la carta nueva tiene rareza, lo actualizamos
          if (carta.rarity) {
            if (Object.values(Rarity).includes(carta.rarity)) {
              newRarity = carta.rarity;
            } else {
              callback(new Error(chalk.red.bold("Invalid rarity")));
              return;
            }
          }
          const newCard: ICard = {
            id: card.id,
            name: carta.name || card.name,
            manaCost: carta.manaCost || card.manaCost,
            color: newColor,
            lineType: newTypeLine,
            rarity: newRarity,
            ruleText: carta.ruleText || card.ruleText,
            strength: carta.strength || card.strength,
            endurance: carta.endurance || card.endurance,
            brandsLoyalty: carta.brandsLoyalty || card.brandsLoyalty,
            marketValue: carta.marketValue || card.marketValue,
          };
          handler.updateCard(newCard, parseInt(message.data[1]), (error) => {
            if (error) {
              console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
              callback(error);
              return;
            } else {
              console.log(chalk.green.bold("Operacion realizada con exito"));
              callback(null, chalk.green.bold("Card updated successfully"));
            }
          });
        }
      });
      break;
    case MessageType.LIST:
      console.log(chalk.yellow("Se ha solicitado listar todas las cartas por parte del usuario: " + message.data[0]))
      handler.getStringCollection((error, string) => {
        if (error) {
          console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
          callback(error);
          return;
        } else {
          console.log(chalk.green.bold("Operacion realizada con exito"));
          callback(null, string);
        }
      });
      break;
    default:
      callback(new Error(chalk.red.bold("Unknown message type")));
  }
}
