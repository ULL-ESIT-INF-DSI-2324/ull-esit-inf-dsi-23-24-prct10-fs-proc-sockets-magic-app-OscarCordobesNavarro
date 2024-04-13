// import "mocha";
// import { expect } from "chai";
// import { Color } from "../src/Previo/IColor.js";
// import { Rarity } from "../src/Previo/IRarity.js";
// import { TypeLine } from "../src/Previo/ITypeLine.js";
// import { ICard } from "../src/Previo/ICard.js";
// import { CardCollectionsHandlerAsync } from "../src/Modificacion/index.js";

// describe("Asyncronous function addCard from CardCollectionsHandlerAsync", () => {
//   it("addCard should add a card to the collection", (done) => {
//     const handler = new CardCollectionsHandlerAsync("testCollection");
//     handler.clearCollection();
//     const carta: ICard = {
//       id: 1,
//       name: "testCard",
//       manaCost: 1,
//       color: Color.Red,
//       lineType: TypeLine.Artifact,
//       rarity: Rarity.Common,
//       ruleText: "test rule text",
//       strength: 1,
//       endurance: 1,
//       brandsLoyalty: 7,
//       marketValue: 1,
//     };

//     handler.addCard(carta, (error) => {
//       expect(error).to.be.null;
//       done();
//     });
//   });

//   it("addCard two times should provide an error", (done) => {
//     const handler = new CardCollectionsHandlerAsync("testCollection");
//     const carta: ICard = {
//       id: 1,
//       name: "testCard",
//       manaCost: 1,
//       color: Color.Red,
//       lineType: TypeLine.Artifact,
//       rarity: Rarity.Common,
//       ruleText: "test rule text",
//       strength: 1,
//       endurance: 1,
//       brandsLoyalty: 7,
//       marketValue: 1,
//     };

//     handler.clearCollection();

//     handler.addCard(carta, (error) => {
//       expect(error).to.be.null;
//     });

//     setTimeout(() => {
//       handler.addCard(carta, (error) => {
//         expect(error?.message).to.be.equal(
//           "Card already exists at testCollection collection",
//         );
//         done();
//       });
//     }, 1000);
//   });

//   it("remove a card that exists should not provide an error", (done) => {
//     const handler = new CardCollectionsHandlerAsync("testCollection");
//     const carta: ICard = {
//       id: 1,
//       name: "testCard",
//       manaCost: 1,
//       color: Color.Red,
//       lineType: TypeLine.Artifact,
//       rarity: Rarity.Common,
//       ruleText: "test rule text",
//       strength: 1,
//       endurance: 1,
//       brandsLoyalty: 7,
//       marketValue: 1,
//     };

//     handler.clearCollection();

//     handler.addCard(carta, (error) => {
//       expect(error).to.be.null;
//     });

//     setTimeout(() => {
//       handler.removeCard(1, (error) => {
//         expect(error).to.be.null;
//         done();
//       });
//     }, 1000);
//   });

//   it("remove a card that does not exist should provide an error", (done) => {
//     const handler = new CardCollectionsHandlerAsync("testCollection");
//     handler.clearCollection();

//     handler.removeCard(1, (error) => {
//       expect(error?.message).to.be.equal(
//         "Card not found at testCollection collection",
//       );
//       done();
//     });
//   });

//   it("remove a card from a user that does not exist should provide an error", (done) => {
//     const handler = new CardCollectionsHandlerAsync("123");

//     handler.removeCard(1, (error) => {
//       expect(error?.message).to.be.equal("Card not found at 123 collection");
//       done();
//     });
//   });
// });
