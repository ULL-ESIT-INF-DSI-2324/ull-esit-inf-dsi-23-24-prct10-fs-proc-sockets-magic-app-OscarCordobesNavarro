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

/**
 * Crea un servidor TCP que escucha en el puerto 60300 y maneja las conexiones de los clientes.
 *
 * @param {net.Socket} socket - El socket de la conexión del cliente.
 */
export const server = net
  .createServer((socket) => {
    console.log("Cliente conectado" + " " + new Date().toISOString());
    let buffer = Buffer.alloc(0);

    /**
     * Maneja los datos recibidos del cliente.
     *
     * @param {Buffer} data - Los datos recibidos del cliente.
     */
    socket.on("data", (data) => {
      buffer = Buffer.concat([buffer, data]);

      while (buffer.length >= 4) {
        const longitud = buffer.readInt32BE(0);

        if (buffer.length >= longitud + 4) {
          const mensajeString = buffer
            .subarray(4, longitud + 4)
            .toString("utf8");

          /**
           * Maneja el mensaje recibido del cliente y envía una respuesta.
           *
           * @param {string} mensaje - El mensaje recibido del cliente.
           * @param {function} callback - La función de devolución de llamada para enviar la respuesta.
           */
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
      console.log("Cliente desconectado a las " + new Date().toISOString());
    });

    socket.on("error", (error) => {
      console.log("Error: " + error);
    });
  })
  .listen(60300, () => {
    console.log("Escuchando en el puerto 60300");
  });
