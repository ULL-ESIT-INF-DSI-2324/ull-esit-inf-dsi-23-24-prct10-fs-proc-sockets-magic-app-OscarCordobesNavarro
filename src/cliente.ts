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

export enum MessageType {
  READ = "read",
  ADD = "add",
  REMOVE = "remove",
  UPDATE = "update",
  LIST = "list",
}

export class MagicClient {
  private socket: net.Socket;
  private data: string = "";

  constructor(private puerto: number = 60300) {
    this.puerto = puerto;
    this.socket = net.connect({ port: this.puerto });

    this.socket.on("error", (error) => {
      console.log("Ha ocurrido un error al conectar con el servidor: " + error);
    });
  }

  public init(msg: string): void {
    this.sendArgv(msg);
    this.listenServer();
  }

  /**
   * Función que envía los argumentos al servidor, primero envía el tamaño del argumento
   * y luego envía los argumentos
   * @param argumentos Argumentos que se le pasan al servidor
   */
  private sendArgv(argumentos: string): void {
    console.log("Argumentos del cliente: " + argumentos);
    // Dividimos los argumentos por su espacio

    // const mensajeString = JSON.stringify(argumentos);
    const longitudMensaje = Buffer.byteLength(argumentos, "utf8");

    // Creacion del mensaje con longitud
    const mensajeConLongitud = Buffer.alloc(4 + longitudMensaje);
    mensajeConLongitud.writeInt32BE(longitudMensaje, 0);
    mensajeConLongitud.write(argumentos, 4, "utf8");

    this.socket.write(mensajeConLongitud);
  }

  private listenServer(): void {
    this.socket.on("data", (data) => {
      this.data += data;
    });

    this.socket.on("close", () => {
      console.log("Cliente desconectado");
    });

    this.socket.on("data", (data) => {
      let buffer = Buffer.from(data);

      while (buffer.length >= 4) {
        const longitud = buffer.readInt32BE(0);

        if (buffer.length >= longitud + 4) {
          const respuestaString = buffer
            .slice(4, longitud + 4)
            .toString("utf8");
          const respuesta = JSON.parse(respuestaString);

          // Aquí puedes procesar la respuesta recibida
          console.log("Respuesta recibida:", respuesta.data);

          // Limpieza del buffer
          buffer = buffer.slice(longitud + 4);
        } else {
          break;
        }
      }
    });
  }
}

// const client = new MagicClient();
// client.init();
