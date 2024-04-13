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

let wholeData = "";

const server = net.createServer((socket) => {
  console.log("Cliente conectado" + " " + new Date().toISOString() + " " + socket.address());

  socket.on("data", (data) => {
    wholeData += data;
  });

  socket.on("end", () => {
    console.log("Cliente desconectado a las " + new Date().toISOString());
    const message = JSON.parse(wholeData);
    console.log("Datos recibidos: " + message);
  });

  socket.on("close", () => {
    console.log("Cliente desconectado");
  });

  socket.on("error", (error) => {
    console.log("Error: " + error);
  });

}).listen(60300, () => {
  console.log("Escuchando en el puerto 60300");
});
