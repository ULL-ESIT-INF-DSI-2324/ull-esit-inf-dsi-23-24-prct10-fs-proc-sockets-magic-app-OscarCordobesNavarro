/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 10/04/2024
 * Práctica 10: Aplicación cliente-servidor para coleccionistas de cartas Magic
 */

// Ejemplo de uso de peticion http

import request from "request";

// const location = process.argv[2];

// const url = `http://api.weatherstack.com/current?access_key=aeb97bf5fbae1e796215bb0be875d548&query=${location}&units=m`;

// request({ url: url, json: true }, (error: Error, response) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(response.body);
//   }
// });

// Ejecución del programa -> node dist/index.js 'San Cristobal de La Laguna, Spain'

// -------- Patrón Callback --------

/**
 * Estamos encapsulando la logica de la peticion http en una función.
 * Pero vemos que dentro tenemos "request" que es una función que recibe un callback.
 * La respuesta de la api se maneja en el callback y no puede salir de la función.
 *
 * El manejador se ejecuta de forma asíncrona, por lo que no podemos devolver la respuesta de la api.
 *
 * Para solucionar esto, podemos aplicar el patrón callback.
 *
 */
// function weatherInfo(location: string) {
//   const url = `http://api.weatherstack.com/current?access_key=aeb97bf5fbae1e796215bb0be875d548&query=${encodeURIComponent(location)}&units=m`;

//   request({url: url, json: true}, (error: Error, response) => {
//     if (error) {
//       console.log(`Weatherstack API is not available: ${error.message}`);
//     } else if (response.body.error) {
//       console.log(`Weatherstack API error: ${response.body.error.type}`);
//     } else {
//       console.log(response.body);
//     }
//   });
// };

// weatherInfo(process.argv[2]);

// Ejemplo de patrón callback

/**
 * Vemos que ahora a la función weatherInfor le añadimos un segundo parámetro que es un callback.
 * Que es una función que recibe un error y los datos de la petición simplemente.
 * Ahora ese callback es el que se encarga de manejar la respuesta de la api.
 *
 * De esta forma, podemos manejar la respuesta de la api fuera de la función.
 */

export const weatherInfo = (
  location: string,
  callback: (
    err: string | undefined,
    data: request.Response | undefined,
  ) => void,
) => {
  const url = `http://api.weatherstack.com/current?access_key=aeb97bf5fbae1e796215bb0be875d548&query=${encodeURIComponent(location)}&units=m`;

  request({ url: url, json: true }, (error: Error, response) => {
    if (error) {
      callback(
        `Weatherstack API is not available: ${error.message}`,
        undefined,
      );
    } else if (response.body.error) {
      callback(
        `Weatherstack API error: ${response.body.error.type}`,
        undefined,
      );
    } else {
      callback(undefined, response);
    }
  });
};

/**
 * Ahora podemos manejar la respuesta de la api fuera de la función.
 *
 * Vemos que el callback recibe un error y los datos de la petición.
 * Y podemos manejar la respuesta de la api sin problemas.
 */
// weatherInfo(process.argv[2], (err, data) => {
//   if (err) {
//     console.log(err);
//   } else if (data) {
//     console.log(data.body);
//   }
// });

// Por así decirlo estamos encadenando callbacks de cierta manera

// El patrón callback chaining, para poder encadenar varias llamadas asíncronas.

/**
 * Definicion de otra función que recibe un location y un callback.
 */
export const coordinatesInfo = (
  location: string,
  callback: (
    err: string | undefined,
    data: request.Response | undefined,
  ) => void,
) => {
  const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1IjoiZWR1c2VncmUiLCJhIjoiY2tubmdoMjE0MDA3ODJubndrNnBuenlteCJ9.dtIf0MrkO0Oe12ZM_I7pGw&limit=1`;

  request({ url: url, json: true }, (error: Error, response) => {
    if (error) {
      callback(`Mapbox API is not available: ${error.message}`, undefined);
    } else if (response.body.features.length === 0) {
      callback(`Mapbox API error: no location found`, undefined);
    } else {
      callback(undefined, response);
    }
  });
};

/**
 * Y ahora en la evaluación de la respuesta de la api de las coordenadas, llamamos a la función weatherInfo.
 * Encadenando las llamadas asíncronas. Estamos haciendo un callback chaining.
 * Utilizamos el callback de la función anterior para llamar a la siguiente.
 */
// coordinatesInfo(process.argv[2], (coordErr, coordData) => {
//   if (coordErr) {
//     console.log(coordErr);
//   } else if (coordData) {
//     const longitude: number = coordData.body.features[0].center[0];
//     const latitude: number = coordData.body.features[0].center[1];
//     weatherInfo(`${latitude},${longitude}`, (weatherErr, weatherData) => {
//       if (weatherErr) {
//         console.log(weatherErr);
//       } else if (weatherData) {
//         console.log(
//           `Currently, the temperature is ` +
//             `${weatherData.body.current.temperature} degrees in ` +
//             `${weatherData.body.location.name}`,
//         );
//       }
//     });
//   }
// });

// Ejemplos de ejecución
/**
   * $node dist/index.js 'Barcelona, Spain'
Currently, the temperature is 15 degrees in Barcelona
$node dist/index.js 'Madrid, Spain'
Currently, the temperature is 18 degrees in Madrid
$node dist/index.js 'Kyoto, Japan'
Currently, the temperature is 20 degrees in Kyoto
$node dist/index.js 'wherever12'
Mapbox API error: no location found
   */

// ------------------- Ejemplo casero con una de las funciones para añadir una carta a la colección -------------------

import { ICard } from "../ICard.js";
import { writeFile } from "fs";


export const addCard = (
  card: ICard,
  callback: (error: Error | undefined, data: string | undefined) => void,
) => {
  const filePath = `./data/${card.id}.json`;
  writeFile(filePath, JSON.stringify(card, undefined, 2), (error) => {
    if (error) {
      callback(error, undefined);
    } else {
      callback(undefined, JSON.stringify(card, undefined, 3));
    }
  });
};

import { Color } from "../IColor.js";
import { Rarity } from "../IRarity.js";
import { TypeLine } from "../ITypeLine.js"

const carta: ICard = {
    id: 1,
    name: "testCard",
    manaCost: 1,
    color: Color.Red,
    lineType: TypeLine.Artifact,
    rarity: Rarity.Common,
    ruleText: "test rule text",
    strength: 1,
    endurance: 1,
    brandsLoyalty: 7,
    marketValue: 1,
};

addCard(carta, (error, data) => {
    if (error) {
        console.log("Error al añadir carta")
        console.log(error);
    } else if (data) {
        console.log("Carta añadida correctamente");
        console.log(data);
    }
})


