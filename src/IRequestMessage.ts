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

import { MessageType } from "./MessageType.js";

/**
 * Interfaz que representa un mensaje de solicitud.
 * @interface RequestMessage
 */
export interface RequestMessage {
  /**
   * Tipo de mensaje.
   * @property {MessageType} type
   */
  type: MessageType;
  /**
   * Datos del mensaje.
   * @property {string[]} data
   */
  data: string[];
}
