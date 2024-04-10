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
import chalk from "chalk";
import { Color } from "../IColor.js";
import { ICard } from "../ICard.js";

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
   * Devuelve el nombre del usuario.
   * @returns El nombre del usuario.
   */
  public getUserName(): string {
    return this.userName;
  }

  /**
   * Actualiza el nombre del usuario.
   * @param newUser El nuevo nombre del usuario.
   */
  public updateUser(newUser: string): void {
    this.userName = newUser;
    this.userDirectory = path.join(this.userCollectionPath, this.userName);
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
   * Lee la colección de cartas del usuario.
   * @returns La colección de cartas del usuario.
   */
  private readCollection(): ICard[] {
    const files = fs.readdirSync(this.userDirectory);
    const cards: ICard[] = [];

    for (const file of files) {
      const filePath = path.join(this.userDirectory, file);
      const data = fs.readFileSync(filePath, "utf-8");
      const card = JSON.parse(data);
      cards.push(card);
    }

    return cards;
  }

  /**
   * Escribe una carta en un archivo.
   * @param card Carta a escribir.
   */
  private writeCardToFile(card: ICard): void {
    const filePath = this.getCardFilePath(card.id);
    const directoryPath = path.dirname(filePath);

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(card, null, 1));
  }

  /**
   * Elimina un archivo de carta.
   * @param id Identificador de la carta.
   */
  private deleteCardFile(id: number): void {
    const filePath = this.getCardFilePath(id);
    fs.unlinkSync(filePath);
  }

  /**
   * Método público para mostrar una carta de la colección.
   * @param id Identificador de la carta.
   */
  public showCard(id: number): void {
    const filePath = this.getCardFilePath(id);

    if (!fs.existsSync(this.userDirectory)) {
      throw new Error("Collection not found");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Card not found");
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const card = JSON.parse(data);
    this.printCard(card);
  }

  /**
   * Método público para actualizar una carta de la colección.
   * @param card Carta a la que se va a actualizar.
   * @param id Identificador de la carta.
   */
  public updateCard(card: ICard, id: number): void {
    if (card.id !== id) {
      throw new Error("Card ID and parameter ID do not match");
    }

    const filePath = this.getCardFilePath(id);

    if (!fs.existsSync(this.userDirectory)) {
      throw new Error("Collection not found");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Card not found at " + this.userName + " collection");
    }

    this.writeCardToFile(card);
  }

  /**
   * Método público para listar las cartas de la colección.
   */
  public listCollection(): void {
    if (!fs.existsSync(this.userDirectory)) {
      throw new Error("Collection not found");
    }
    const cards = this.readCollection();

    if (cards.length === 0) {
      throw new Error("Collection is empty");
    }

    console.log(chalk.green.bold("Collection of " + this.userName + ":"));
    cards.forEach((card) => {
      console.log("---------------------------------");
      this.printCard(card);
    });
  }

  /**
   * Método privado para imprimir una carta.
   * @param card Carta a imprimir.
   */
  private printCard(card: ICard): void {
    const colorName = Object.keys(Color).find(
      (key) => Color[key as keyof typeof Color] === card.color,
    );
    console.log(
      "\n " + chalk.blue.bold("Card ID: ") + card.id + "\n",
      chalk.blue.bold("Card Name: ") + card.name + "\n",
      chalk.blue.bold("Card Mana Cost: ") + card.manaCost + "\n",
      chalk.hex(card.color).bold("Card Color: ") + colorName + "\n",
      chalk.blue.bold("Card Type Line: ") + card.lineType + "\n",
      chalk.blue.bold("Card Rarity: ") + card.rarity + "\n",
      chalk.blue.bold("Card Rules Text: ") + card.ruleText + "\n",
      chalk.blue.bold("Card Market Value: ") + card.marketValue + "\n",
    );
  }

  /**
   * Método público para obtener una carta de la colección.
   * @param id Identificador de la carta.
   * @returns La carta de la colección.
   */
  public getCard(id: number): ICard {
    const filePath = this.getCardFilePath(id);

    if (!fs.existsSync(this.userDirectory)) {
      throw new Error("Collection not found");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Card not found at " + this.userName + " collection");
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const card = JSON.parse(data);
    return card;
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
    const filePath = this.getCardFilePath(card.id);

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
