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

/**
 * Clase que representa un cliente mágico que se conecta a un servidor mágico.
 */
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

  /**
   * Inicializa el cliente mágico enviando un mensaje al servidor y escuchando las respuestas.
   * @param msg Todos los argumentos que se le pasan al servidor
   */
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
    const longitudMensaje = Buffer.byteLength(argumentos, "utf8");

    const mensajeConLongitud = Buffer.alloc(4 + longitudMensaje);
    mensajeConLongitud.writeInt32BE(longitudMensaje, 0);
    mensajeConLongitud.write(argumentos, 4, "utf8");

    this.socket.write(mensajeConLongitud);
  }

  /**
   * Escucha los datos recibidos desde el servidor.
   */
  private listenServer(): void {
    this.socket.on("data", (data) => {
      this.data += data;
    });

    this.socket.on("data", (data) => {
      let buffer = Buffer.from(data);

      while (buffer.length >= 4) {
        const longitud = buffer.readInt32BE(0);

        if (buffer.length >= longitud + 4) {
          const respuestaString = buffer
            .subarray(4, longitud + 4)
            .toString("utf8");
          const respuesta = JSON.parse(respuestaString);

          // Aquí puedes procesar la respuesta recibida
          console.log(respuesta.data);

          // Limpieza del buffer
          buffer = buffer.subarray(longitud + 4);
        } else {
          break;
        }
      }
    });
  }
}
