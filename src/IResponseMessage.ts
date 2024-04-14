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

/**
 * Interfaz que representa un mensaje de respuesta.
 */
export interface ResponseMessage {
  /**
   * Indica si la operación ha sido exitosa.
   * @property {boolean} success
   */
  success: boolean;
  /**
   * Datos del mensaje.
   * @property {string} data
   */
  data: string;
}
