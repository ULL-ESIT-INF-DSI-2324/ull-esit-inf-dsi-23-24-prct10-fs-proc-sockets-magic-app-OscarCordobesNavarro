// import "mocha";
// import { expect } from "chai";
// import { weatherInfo, coordinatesInfo } from "../src/Modificacion/index";

// // Ejemplo de ejecucion asíncrona

// describe("Asynchronous function weatherInfo tests", () => {
//   it("weatherInfo should get weather information", (done) => {
//     weatherInfo("Tenerife, Spain", (_, data) => {
//       if (data) {
//         expect(data.body.location.name).to.be.equal("Tenerife");
//         done();
//       }
//     });
//   });

//   it("weatherInfo should provide an error", (done) => {
//     weatherInfo("12wherever", (error) => {
//       if (error) {
//         expect(error).to.be.equal("Weatherstack API error: request_failed");
//         done();
//       }
//     });
//   });
// });

// describe("Asynchronous function coordinatesInfo tests", () => {
//   it("coordinatesInfo should get coordinates information", (done) => {
//     coordinatesInfo("Barcelona, Spain", (_, data) => {
//       if (data) {
//         expect(data.body.features[0].center).to.be.eql([2.177432, 41.382894]);
//         done();
//       }
//     });
//   });

//   it("coordinatesInfo should provide an error", (done) => {
//     coordinatesInfo("12wherever", (error) => {
//       if (error) {
//         expect(error).to.be.equal("Mapbox API error: no location found");
//         done();
//       }
//     });
//   });
// });

import "mocha";
import { expect } from "chai";
import { addCard } from "../src/Modificacion/index.js";

import { Color } from "../src/IColor.js";
import { Rarity } from "../src/IRarity.js";
import { TypeLine } from "../src/ITypeLine.js"
import { ICard } from "../src/ICard.js";

describe("Asyncronous function addCard tests", () => {
    it("addCard should add a card to the collection", (done) => {
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
            if (data) {
                expect(data).to.be.equal(JSON.stringify(carta, undefined, 3));
                done();
            }
        });

    });
});