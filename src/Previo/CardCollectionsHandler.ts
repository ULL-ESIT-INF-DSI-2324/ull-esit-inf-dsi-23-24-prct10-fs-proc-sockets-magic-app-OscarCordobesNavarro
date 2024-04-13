/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 07/04/2024
 * Práctica 9: Filesystem  of node.js
 */
import { ICard } from "./ICard.js";
import { Color } from "./IColor.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";


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

  public getUserCollectionDirectory(): string {
    return this.userDirectory;
  }

  public getUsername(): string {
    return this.userName;
  }

  public updateUser(newUser: string): void {
    this.userName = newUser;
    this.userDirectory = path.join(this.userCollectionPath, this.userName);
  }

  private getCardFilePath(id: number): string {
    return path.join(this.userDirectory, `${id}.json`);
  }

  // Funcion que dada una carta, la escribe en el directorio del usuario
  // con el id de la carta como nombre del archivo .json
  private writeCardToFile(card: ICard, callback: (error: Error | null) => void): void {
    // Comprobamos si el directorio de la coleccion del usuario existe
    this.checkUserDirectory((err) => {
      if (err) {
        // Creamos el directorio si no existe y escribimos la carta
        fs.mkdir(this.userDirectory, (err) => {
          if (err) {
            return callback(err);
          }
          this.checkCardFileAndWrite(card, callback);
        });
      } else {
        this.checkCardFileAndWrite(card, callback);
      }
    });
  }

  // Funcion que dada una carta y un callback, comprueba si el archivo de la carta ya existe y la escribe
  private checkCardFileAndWrite(card: ICard, callback: (error: Error | null) => void): void {
    const filePath = this.getCardFilePath(card.id);
    const data = JSON.stringify(card, undefined, 2);
    this.checkCardFile(card.id, (err) => {
      if (err) {
        return callback(err);
      } else {
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      }
    });
  }

  // Funcion que comprueba de manera asincrona si el directorio de la coleccion del usuario existe
  private checkUserDirectory(callback: (error: Error | null) => void): void {
    fs.access(this.userDirectory, fs.constants.F_OK, (err) => {
      if (err) {
        const error = new Error("Collection not found");
        return callback(error);
      } else {
        return callback(null);
      }
    });
  }

  // Funcion que comprueba de manera asincrona si el archivo de la carta ya existe
  private checkCardFile(id: number, callback: (error: Error | null) => void): void {
    const filePath = this.getCardFilePath(id);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return callback(null);
      } else {
        const error = new Error(
          `Card already exists at ${this.userName} collection`,
        );
        return callback(error);
      }
    });
  }

  // Funcion que encapsula la escritura de una carta en un archivo, y escribe la carta
  public addCard(card: ICard, callback: (error: Error | null) => void): void {

    if(card.lineType === "Creature" && (!card.strength || !card.endurance)) {
      callback(new Error("Creature card must have strength and endurance"));
    }
    if(card.lineType === "Planeswalker" && !card.brandsLoyalty) {
      callback(new Error("Planeswalker card must have brands loyalty"));
    }
    this.writeCardToFile(card, callback);
  }

  public clearCollection(callback: (error: Error | null) => void): void {
    fs.access(this.userDirectory, fs.constants.F_OK, (errAccess) => {
      if (errAccess) {
        return callback(null);
      } else {
        fs.rm(this.userDirectory, { recursive: true }, (errRemove) => {
          if (errRemove) {
            return callback(errRemove);
          }
          return callback(null);
        });
      }
    });
  }

  public getCard(id: number, callback: (error: Error | null, card: ICard | null) => void): void {
    const filePath = this.getCardFilePath(id);

    // Comprobamos si el directorio existe
    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error("Collection not found");
        return callback(error, null);
      } else {
        // Comprobamos si el archivo de la carta existe
        fs.access(filePath, fs.constants.F_OK, (errAccess) => {
          if (errAccess) {
            const error = new Error(
              `Card not found at ${this.userName} collection`,
            );
            return callback(error, null);
          } else {
            fs.readFile(filePath, "utf-8", (errRead, data) => {
              if (errRead) {
                const error = new Error(
                  `Error reading card file: ${errRead.message}`,
                );
                return callback(error, null);
              }

              try {
                const card = JSON.parse(data) as ICard;
                return callback(null, card);
              } catch (parseError) {
                const error = new Error(
                  `Error parsing card data: ${parseError.message}`,
                );
                return callback(error, null);
              }
            });
          }
        });
      }
    });
  }

  public removeCard(id: number, callback: (error: Error | null) => void): void {
    const filePath = this.getCardFilePath(id);

    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error("Collection not found");
        return callback(error);
      } else {
        fs.access(filePath, fs.constants.F_OK, (errAccess) => {
          if (errAccess) {
            const error = new Error(
              `Card not found at ${this.userName} collection`,
            );
            return callback(error);
          } else {
            fs.unlink(filePath, (err) => {
              if (err) {
                return callback(err);
              }
              return callback(null);
            });
          }
        });
      }
    });
  }

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

  public showCard(id: number, callback: (error: Error | null) => void): void {
    this.getCard(id, (error, card) => {
      if (error) {
        return callback(error);
      }
      this.printCard(card as ICard);
      return callback(null);
    });
  }

  public listCollection(callback: (error: Error | null) => void): void {
    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error("Collection not found");
        return callback(error);
      } else {
        fs.readdir(this.userDirectory, (err, files) => {
          if (err) {
            return callback(err);
          }
          if (files.length === 0) {
            const error = new Error("Collection is empty");
            return callback(error);
          }
          console.log(chalk.green.bold("Collection of " + this.userName + ":"));
          files.forEach((file) => {
            const filePath = path.join(this.userDirectory, file);
            fs.readFile(filePath, "utf-8", (err, data) => {
              if (err) {
                return callback(err);
              }
              const card = JSON.parse(data) as ICard;
              console.log("---------------------------------");
              this.printCard(card);
            });
          });
          return callback(null);
        });
      }
    });
  }

  public updateCard(card: ICard, id: number, callback: (error: Error | null) => void): void {
    if (card.id !== id) {
      const error = new Error("Card ID and parameter ID do not match");
      return callback(error);
    }

    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error("Collection not found");
        return callback(error);
      } else {
        this.removeCard(id, (err) => {
          if (err) {
            return callback(err);
          }
          this.writeCardToFile(card, (err) => {
            if (err) {
              return callback(err);
            }
            return callback(null);
          });
        });
      }
    });
  }
}