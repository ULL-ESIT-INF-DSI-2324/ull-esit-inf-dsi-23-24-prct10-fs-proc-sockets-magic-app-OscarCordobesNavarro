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
import fs from "fs";
import path from "path";
import { ICard } from "../Previo/ICard.js";

export class CardCollectionsHandlerAsync {
  private userCollectionPath: string = "./data/";
  private userName: string = "";
  private userDirectory: string = "";

  constructor(userName?: string) {
    if (userName) {
      this.userName = userName;
      this.userDirectory = path.join(this.userCollectionPath, this.userName);
    }
  }
  /**
   * Devuelve la ruta de la colección del usuario.
   * @returns La ruta de la colección del usuario.
   */
  public getUserCollectionDirectory(): string {
    return this.userDirectory;
  }

  /**
   * Obtiene la ruta de un archivo de carta.
   * @param id El identificador de la carta.
   * @returns La ruta del archivo de la carta.
   */
  private getCardFilePath(id: number): string {
    return path.join(this.userDirectory, `${id}.json`);
  }



  /**
   * Método público para limpiar la colección.
   * Limpia el directorio de la colección del usuario.
   */
  public clearCollection(): void {
    if (!fs.existsSync(this.userDirectory)) {
      return;
    }
    const files = fs.readdirSync(this.userDirectory);

    for (const file of files) {
      const filePath = path.join(this.userDirectory, file);
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Modificaciones de la sesion PE101
   */

  /**
   * Escribe una tarjeta en un archivo de forma asíncrona.
   *
   * @param card La tarjeta a escribir en el archivo.
   * @param callback Una función de devolución de llamada que se ejecuta después de que se complete la escritura del archivo.
   *                 Recibe un parámetro de error en caso de que ocurra un error durante la escritura.
   */
  private writeCardToFileAsync(
    card: ICard,
    callback: (error: Error | null) => void,
  ): void {
    const filePath = this.getCardFilePath(card.id);
    const directoryPath = path.dirname(filePath);

    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        return callback(error);
      }

      fs.writeFile(filePath, JSON.stringify(card, null, 1), (error) => {
        if (error) {
          return callback(error);
        }
        callback(null);
      });
    });
  }

  /**
   * Método público para añadir una carta a la colección de forma asíncrona.
   *
   * @param card La carta a añadir a la colección.
   * @param callback Una función de devolución de llamada que se ejecuta después de que se complete la operación.
   *                 Recibe un parámetro de error en caso de que ocurra un error durante la operación.
   */
  public addCard(card: ICard, callback: (error: Error | null) => void): void {
    // const filePath = this.getCardFilePath(card.id);

    this.cardExists(card.id, (exists) => {
      if (exists) {
        return callback(
          new Error("Card already exists at " + this.userName + " collection"),
        );
      }

      if (card.lineType === "Creature" && (!card.strength || !card.endurance)) {
        return callback(
          new Error("Creature card must have strength and endurance"),
        );
      }

      if (card.lineType === "Planeswalker" && !card.brandsLoyalty) {
        return callback(
          new Error("Planeswalker card must have brands loyalty"),
        );
      }

      this.writeCardToFileAsync(card, (error) => {
        if (error) {
          return callback(error);
        }
        callback(null);
      });
    });
  }

  /**
   * Método público para eliminar una carta de la colección de forma asíncrona.
   *
   * @param id El identificador de la carta a eliminar.
   * @param callback Una función de devolución de llamada que se ejecuta después de que se complete la operación.
   *                 Recibe un parámetro de error en caso de que ocurra un error durante la operación.
   */
  public removeCard(id: number, callback: (error: Error | null) => void): void {
    this.cardExists(id, (exists) => {
      if (!exists) {
        return callback(
          new Error("Card not found at " + this.userName + " collection"),
        );
      }

      const filePath = this.getCardFilePath(id);
      this.deleteCardFileAsync(filePath, (error) => {
        if (error) {
          return callback(error);
        }
        callback(null);
      });
    });
  }

  /**
   * Método privado para eliminar un archivo de carta de forma asíncrona.
   *
   * @param filePath La ruta del archivo de la carta a eliminar.
   * @param callback Una función de devolución de llamada que se ejecuta después de que se complete la eliminación del archivo.
   *                 Recibe un parámetro de error en caso de que ocurra un error durante la eliminación.
   */
  private deleteCardFileAsync(
    filePath: string,
    callback: (error: Error | null) => void,
  ): void {
    fs.unlink(filePath, (error) => {
      if (error) {
        return callback(error);
      }
      callback(null);
    });
  }

  /**
   * Método privado para comprobar si una carta existe.
   *
   * @param id El identificador de la carta a comprobar.
   * @param callback Una función de devolución de llamada que se ejecuta después de que se complete la comprobación.
   *                 Recibe un parámetro booleano que indica si la carta existe o no.
   */
  private cardExists(id: number, callback: (exists: boolean) => void): void {
    const filePath = this.getCardFilePath(id);

    fs.access(filePath, fs.constants.F_OK, (error) => {
      if (error) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
}
