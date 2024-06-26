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
import { Color } from "./Previo/IColor.js";
import { Rarity } from "./Previo/IRarity.js";
import { TypeLine } from "./Previo/ITypeLine.js";

import { MagicClient } from "./MagicClient.js";
import { MessageType } from "./MessageType.js";

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
  .strict()
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

      console.log(JSON.stringify(argv, undefined, 2));
      const client = new MagicClient();
      client.init(
        JSON.stringify({
          type: MessageType.ADD,
          data: [
            argv.user,
            argv.id.toString(),
            argv.name,
            argv.manaCost.toString(),
            color.toString(),
            typeLine.toString(),
            rarity.toString(),
            argv.ruleText,
            argv.strength?.toString(),
            argv.endurance?.toString(),
            argv.brandsLoyalty?.toString(),
            argv.marketValue.toString(),
          ],
        }),
      );
    },
  ).strict()
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
      const client = new MagicClient();
      client.init(
        JSON.stringify({
          type: MessageType.REMOVE,
          data: [argv.user, argv.id.toString()],
        }),
      );
    },
  )
  .strict()
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
      const client = new MagicClient();
      client.init(
        JSON.stringify({
          type: MessageType.READ,
          data: [argv.user, argv.id.toString()],
        }),
      );
    },
  ).strict()
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
      const client = new MagicClient();
      client.init(
        JSON.stringify({
          type: MessageType.UPDATE,
          data: [
            argv.user,
            argv.id.toString(),
            argv.name,
            argv.manaCost?.toString(),
            argv.color,
            argv.lineType,
            argv.rarity,
            argv.ruleText,
            argv.strength?.toString(),
            argv.endurance?.toString(),
            argv.brandsLoyalty?.toString(),
            argv.marketValue?.toString(),
          ],
        }),
      );
    },
  ).strict()
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
      const client = new MagicClient();
      client.init(
        JSON.stringify({
          type: MessageType.LIST,
          data: [argv.user],
        }),
      );
    },
  )
  .help().argv;
