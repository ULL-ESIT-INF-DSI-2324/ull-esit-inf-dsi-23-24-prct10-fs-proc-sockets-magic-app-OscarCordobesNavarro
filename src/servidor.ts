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
import { ResponseMessage } from "./IResponseMessage.js";
import { messageHandler } from "./messageHandler.js";

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

