import 'mocha';
import {expect} from 'chai';
import {CardCollectionsHandler} from "../src/CardCollectionsHandler.js";
import { Color } from '../src/IColor.js';
import { Rarity } from '../src/IRarity.js';
import { TypeLine } from '../src/ITypeLine.js';
import { ICard } from '../src/ICard.js';

// Deshabilitamos la salida estandar
before(()=> {
    console.log = () => {};
})

describe("CardCollectionsHandler tests", () => {
    describe("updateUser function tests", () => {
        it("getUser should return testUser", () => {
            const cardHandler = new CardCollectionsHandler("testUser");

            expect(cardHandler.getUserName()).to.be.equal("testUser");
        });

        it("updateUser('testUser') returns userCollectionDirectory 'data/testUser'", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            cardHandler.updateUser("testUser");
            expect(cardHandler.getUserCollectionDirectory()).to.be.equal("data/testUser");
        });
    });

    describe("addCard, removeCard and getCard methods tests", () => {
        // Actualizamos el path para las pruebas
        it("add a card and get it again should be the same", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            expect(cardHandler.getCard(1)).to.be.not.undefined;
            expect(cardHandler.getCard(1)).to.be.deep.equal(carta);
        });

        it("add the same card twice, the second one should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            expect(() => cardHandler.addCard(carta)).to.throw("Card already exists at testUser collection");
        });

        it("add a card and remove it two times, the second one should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            cardHandler.removeCard(1);
            expect(() => cardHandler.removeCard(1)).to.throw("Card not found at testUser collection");
        });

        it("remove a card that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            cardHandler.clearCollection();
            expect(() => cardHandler.removeCard(1)).to.throw("Card not found at testUser collection");
        });

        it("get a card that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            cardHandler.clearCollection();
            expect(() => cardHandler.getCard(1)).to.throw("Card not found at testUser collection");
        });

        it("remove a card from a collection that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("exampleUser");
            try {
                cardHandler.removeCard(1);
            } catch (error) {
                expect(error.message).to.be.equal("Collection not found");
            }
        });

        it("get a card from a collection that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("exampleUser");
            try {
                cardHandler.getCard(1);
            } catch (error) {
                expect(error.message).to.be.equal("Collection not found");
            }
        });

        it("add a card that is a creature without strength and endurance should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            const carta: ICard = {
                id: 1,
                name: "testCard",
                manaCost: 1,
                color: Color.Red,
                lineType: TypeLine.Creature,
                rarity: Rarity.Common,
                ruleText: "test rule text",
                strength: 1,
                endurance: 0,
                brandsLoyalty: 7,
                marketValue: 1,
            };
            cardHandler.clearCollection();
            expect(() => cardHandler.addCard(carta)).to.throw("Creature card must have strength and endurance");
        });

        it("add a card that is a planeswalker without brands loyalty should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            const carta: ICard = {
                id: 1,
                name: "testCard",
                manaCost: 1,
                color: Color.Red,
                lineType: TypeLine.Planeswalker,
                rarity: Rarity.Common,
                ruleText: "test rule text",
                strength: 1,
                endurance: 1,
                brandsLoyalty: 0,
                marketValue: 1,
            };
            cardHandler.clearCollection();
            expect(() => cardHandler.addCard(carta)).to.throw("Planeswalker card must have brands loyalty");
        });
    });

    describe("updateCard methodtests", () => {
        it("update a card that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            cardHandler.clearCollection();
            expect(() => cardHandler.updateCard(carta, 1)).to.throw("Card not found at testUser collection");
        });

        it("update a card that exists should update it", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            const carta2: ICard = {
                id: 1,
                name: "testCard2",
                manaCost: 2,
                color: Color.Blue,
                lineType: TypeLine.Creature,
                rarity: Rarity.Rare,
                ruleText: "test rule text 2",
                strength: 2,
                endurance: 2,
                brandsLoyalty: 8,
                marketValue: 2,
            };
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            cardHandler.updateCard(carta2, 1);
            expect(cardHandler.getCard(1)).to.be.deep.equal(carta2);
        });
        it("update a card with different id should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            const carta2: ICard = {
                id: 2,
                name: "testCard2",
                manaCost: 2,
                color: Color.Blue,
                lineType: TypeLine.Creature,
                rarity: Rarity.Rare,
                ruleText: "test rule text 2",
                strength: 2,
                endurance: 2,
                brandsLoyalty: 8,
                marketValue: 2,
            };
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            expect(() => cardHandler.updateCard(carta2, 1)).to.throw("Card ID and parameter ID do not match");
        });

        it ("update a card from a collection that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("exampleUser");
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
            try {
                cardHandler.updateCard(carta, 1);
            } catch(error) {
                expect(error.message).to.be.equal("Collection not found");
            }
        });

        it ("update a card from a user that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("exampleUser");
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
            try {
                cardHandler.updateCard(carta, 1);
            } catch(error) {
                expect(error.message).to.be.equal("Collection not found");
            }
        });
    });

    describe("showCard method tests", () => {
        it("show a card that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            cardHandler.clearCollection();
            expect(() => cardHandler.showCard(1)).to.throw("Card not found");
        });
        it("show a card that exists should return it", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            expect(() => cardHandler.showCard(1)).to.not.throw();
        });
        it("show a card from a collection that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("exampleUser");
            // Al ser un error que se propaga no se puede hace con un expect en una linea
            try {
                cardHandler.showCard(1);
            } catch (error) {
                expect(error.message).to.be.equal("Collection not found");
            }
        });
    });


    describe("listCollection method tests", () => {
        it("list an empty collection should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
            cardHandler.clearCollection();
            // Lo podemos hacer así porque es un nuevo error
            expect(() => cardHandler.listCollection()).to.throw("Collection is empty");
        });
        it("list a collection with one card should print it", () => {
            const cardHandler = new CardCollectionsHandler("testUser");
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
            cardHandler.clearCollection();
            cardHandler.addCard(carta);
            expect(() => cardHandler.listCollection()).to.not.throw();
        });
        it("list a collection from a user that doesn't exist should throw an error", () => {
            const cardHandler = new CardCollectionsHandler("exampleUser");
            try {
                cardHandler.listCollection();
            } catch (error) {
                expect(error.message).to.be.equal("Collection not found");
            }
        });
    });
});


