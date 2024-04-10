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

import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { CardCollectionsHandler } from "./Previo/CardCollectionsHandler.js";
import { ICard } from "./Previo/ICard.js";
import { Color } from "./Previo/IColor.js";
import { Rarity } from "./Previo/IRarity.js";
import { TypeLine } from "./Previo/ITypeLine.js";

import { MagicClient } from "./cliente.js";

/**
 * Función principal que gestiona los comandos de la aplicación
 *
 * Tiene los comandos:
 * - add: Añade una carta a la colección del usuario
 * - remove: Elimina una carta de la colección del usuario
 * - read: Lee una carta de la colección del usuario
 * - update: Actualiza una carta de la colección del usuario
 * - list: Lista todas las cartas de la colección del usuario
 *
 * Para mas informacion sobre los comandos y sus opciones, ejecutar el comando --help
 */
yargs(hideBin(process.argv))
  .command(
    "add",
    "Add a card to the collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
      id: {
        alias: "i",
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
      name: {
        alias: "n",
        description: "Card Name",
        type: "string",
        demandOption: true,
      },
      manaCost: {
        alias: "m",
        description: "Card Mana Cost",
        type: "number",
        demandOption: true,
      },
      color: {
        alias: "c",
        description: "Card Color, use upper camel case",
        type: "string",
        demandOption: true,
      },
      lineType: {
        alias: "l",
        description: "Card Type Line",
        type: "string",
        demandOption: true,
      },
      rarity: {
        alias: "r",
        description: "Card Rarity",
        type: "string",
        demandOption: true,
      },
      ruleText: {
        alias: "ruletext",
        description: "Card Rule Text",
        type: "string",
        demandOption: true,
      },
      strength: {
        alias: "s",
        description: "Card Strength",
        type: "number",
        demandOption: false,
      },
      endurance: {
        alias: "e",
        description: "Card Endurance",
        type: "number",
        demandOption: false,
      },
      brandsLoyalty: {
        alias: "b",
        description: "Card Brands Loyalty",
        type: "number",
        demandOption: false,
      },
      marketValue: {
        alias: "v",
        description: "Card Market Value",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const color = Color[argv.color as keyof typeof Color];
      const typeLine = TypeLine[argv.lineType as keyof typeof TypeLine];
      const rarity = Rarity[argv.rarity as keyof typeof Rarity];

      if (!color) {
        console.log(chalk.red("Color not found"));
        return;
      }

      if (!typeLine) {
        console.log(chalk.red("Type Line not found"));
        return;
      }

      if (!rarity) {
        console.log(chalk.red("Rarity not found"));
        return;
      }
    },
  )
  .command(
    "remove",
    "Remove a card of the user collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
      id: {
        alias: "i",
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const cardHandler = new CardCollectionsHandler(argv.user);
      try {
        cardHandler.removeCard(argv.id);
        console.log(
          chalk.green("Card removed from " + argv.user + " collection"),
        );
      } catch (error) {
        console.log(chalk.red(error.message));
        return;
      }
    },
  )
  .command(
    "read",
    "Read a card of the user collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
      id: {
        alias: "i",
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      //   const cardHandler = new CardCollectionsHandler(argv.user);
      //   try {
      //     cardHandler.showCard(argv.id);
      //   } catch(error) {
      //     console.log(chalk.red(error.message));
      //     return;
      //   }
      const client = new MagicClient();
      console.log("Los argumentos son: " + JSON.stringify(argv, undefined, 2));
      client.enviarArgumentos(JSON.stringify(argv));
    },
  )
  .command(
    "update",
    "Update a card of the user collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
      id: {
        alias: "i",
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
      name: {
        alias: "n",
        description: "Card Name",
        type: "string",
        demandOption: false,
      },
      manaCost: {
        alias: "m",
        description: "Card Mana Cost",
        type: "number",
        demandOption: false,
      },
      color: {
        alias: "c",
        description: "Card Color, use upper camel case",
        type: "string",
        demandOption: false,
      },
      lineType: {
        alias: "l",
        description: "Card Type Line",
        type: "string",
        demandOption: false,
      },
      rarity: {
        alias: "r",
        description: "Card Rarity",
        type: "string",
        demandOption: false,
      },
      ruleText: {
        alias: "ruletext",
        description: "Card Rule Text",
        type: "string",
        demandOption: false,
      },
      strength: {
        alias: "s",
        description: "Card Strength",
        type: "number",
        demandOption: false,
      },
      endurance: {
        alias: "e",
        description: "Card Endurance",
        type: "number",
        demandOption: false,
      },
      brandsLoyalty: {
        alias: "b",
        description: "Card Brands Loyalty",
        type: "number",
        demandOption: false,
      },
      marketValue: {
        alias: "v",
        description: "Card Market Value",
        type: "number",
        demandOption: false,
      },
    },
    (argv) => {
      const cardHandler = new CardCollectionsHandler(argv.user);
      // Gestionamos el Color, typeLine y rarity si se pasa
      let cardToModify: ICard;
      try {
        cardToModify = cardHandler.getCard(argv.id);
      } catch (error) {
        console.log(chalk.red(error.message));
        return;
      }

      let newColor: Color = cardHandler.getCard(argv.id).color;
      if (argv.color) {
        newColor = Color[argv.color as keyof typeof Color];
        if (!newColor) {
          console.log(chalk.red("Color not found"));
          return;
        }
      }

      let newTypeLine: TypeLine = cardHandler.getCard(argv.id).lineType;
      if (argv.lineType) {
        newTypeLine = TypeLine[argv.lineType as keyof typeof TypeLine];
        if (!newTypeLine) {
          console.log(chalk.red("Type Line not found"));
          return;
        }
      }

      let newRarity: Rarity = cardHandler.getCard(argv.id).rarity;
      if (argv.rarity) {
        newRarity = Rarity[argv.rarity as keyof typeof Rarity];
        if (!newRarity) {
          console.log(chalk.red("Rarity not found"));
          return;
        }
      }

      const newCard: ICard = {
        id: argv.id,
        name: argv.name || cardToModify.name,
        manaCost: argv.manaCost || cardToModify.manaCost,
        color: newColor,
        lineType: newTypeLine,
        rarity: newRarity,
        ruleText: argv.ruleText || cardToModify.ruleText,
        strength: argv.strength || cardToModify.strength,
        endurance: argv.endurance || cardToModify.endurance,
        brandsLoyalty: argv.brandsLoyalty || cardToModify.brandsLoyalty,
        marketValue: argv.marketValue || cardToModify.marketValue,
      };

      try {
        cardHandler.updateCard(newCard, argv.id);
        console.log(
          chalk.green("Card updated at " + argv.user + " collection"),
        );
      } catch (error) {
        console.log(chalk.red(error.message));
        return;
      }
    },
  )
  .command(
    "list",
    "List all cards of the user collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      const cardHandler = new CardCollectionsHandler(argv.user);
      try {
        cardHandler.listCollection();
      } catch (error) {
        console.log(chalk.red(error.message));
        return;
      }
    },
  )
  .help().argv;
