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

net
  .createServer((socket) => {
    console.log("Cliente conectado" + " " + new Date().toISOString());

    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
  })
  .listen(60300, () => {
    console.log("Servidor escuchando en el puerto 60300");
  });
