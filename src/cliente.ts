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


export class MagicClient {
  private socket: net.Socket;

  constructor(private puerto: number = 60300) {
    this.puerto = puerto;
    this.socket = net.connect({ port: this.puerto });

    this.socket.on("error", (error) => {
      console.log("Ha ocurrido un error al conectar con el servidor: " + error);
    });
  }

  public enviarArgumentos(argumentos: string): void {
    console.log("Argumentos del cliente: " + argumentos)
    this.socket.write(JSON.stringify(argumentos));
  }
}



