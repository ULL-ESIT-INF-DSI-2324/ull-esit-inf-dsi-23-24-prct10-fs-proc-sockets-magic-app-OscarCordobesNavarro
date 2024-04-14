import "mocha";
import { expect } from "chai";
import { MagicClient } from "../src/cliente.js";
import { messageHandler } from "../src/messageHandler.js";
import { CardCollectionsHandlerAsync } from "../src/Previo/CardCollectionsHandlerAsync.js";
import chalk from "chalk";
import { error } from "console";
import { Color } from "../src/Previo/IColor.js";
import { Rarity } from "../src/Previo/IRarity.js";
import { TypeLine } from "../src/Previo/ITypeLine.js";

before(() => {
  console.log = () => {};
});

describe("Message handler test", () => {
  it("add a card that do not exist should be added", (done) => {
    const request = {
      type: "add",
      data: [
        "testUser",
        1,
        "cardName",
        2,
        "red",
        "Creature",
        "Common",
        "rule",
        3,
        4,
        5,
        6,
      ],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      messageHandler(JSON.stringify(request), (error, response) => {
        if (error) {
          done(error);
        } else {
          expect(response).to.equal(
            chalk.green.bold("Card added successfully"),
          );
          done();
        }
      });
    });
  });

  it(" if a card is already in the collection, it should return an error", (done) => {
    const request = {
      type: "add",
      data: [
        "testUser",
        1,
        "cardName",
        2,
        "red",
        "Creature",
        "Common",
        "rule",
        3,
        4,
        5,
        6,
      ],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      handler.addCard(
        {
          id: 1,
          name: "cardName",
          manaCost: 2,
          color: Color.Blue,
          lineType: TypeLine.Creature,
          rarity: Rarity.Mythical,
          ruleText: "rule",
          strength: 3,
          endurance: 4,
          brandsLoyalty: 5,
          marketValue: 6,
        },
        (error) => {
          messageHandler(JSON.stringify(request), (error, response) => {
            if (error) {
              expect(error.message).to.equal(
                chalk.red.bold("Card already exists at testUser collection"),
              );
              done();
            } else {
              done("Error not thrown");
            }
          });
        },
      );
    });
  });
  it("remove a card that exist should be successfull", (done) => {
    const request = {
      type: "remove",
      data: ["testUser", 1],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      handler.addCard(
        {
          id: 1,
          name: "cardName",
          manaCost: 2,
          color: Color.Blue,
          lineType: TypeLine.Creature,
          rarity: Rarity.Mythical,
          ruleText: "rule",
          strength: 3,
          endurance: 4,
          brandsLoyalty: 5,
          marketValue: 6,
        },
        (error) => {
          messageHandler(JSON.stringify(request), (error, response) => {
            if (error) {
              done(error);
            } else {
              expect(response).to.equal(
                chalk.green.bold("Card removed successfully"),
              );
              done();
            }
          });
        },
      );
    });
  });

  it("remove a card that do not exist should return an error", (done) => {
    const request = {
      type: "remove",
      data: ["testUser", 1],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      messageHandler(JSON.stringify(request), (error, response) => {
        if (error) {
          expect(error.message).to.equal(
            chalk.red.bold("Collection not found"),
          );
          done();
        } else {
          done("Error not thrown");
        }
      });
    });
  });

  it("read a card that exist should return the card", (done) => {
    const request = {
      type: "read",
      data: ["testUser", 1],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      handler.addCard(
        {
          id: 1,
          name: "cardName",
          manaCost: 2,
          color: Color.Blue,
          lineType: TypeLine.Creature,
          rarity: Rarity.Mythical,
          ruleText: "rule",
          strength: 3,
          endurance: 4,
          brandsLoyalty: 5,
          marketValue: 6,
        },
        (error) => {
          messageHandler(JSON.stringify(request), (error, response) => {
            if (error) {
              done(error);
            } else {
              done();
            }
          });
        },
      );
    });
  });

  it("read a card that do not exist should return an error", (done) => {
    const request = {
      type: "read",
      data: ["testUser", 1],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      messageHandler(JSON.stringify(request), (error, response) => {
        if (error) {
          expect(error.message).to.equal(
            chalk.red.bold("Collection not found"),
          );
          done();
        } else {
          done("Error not thrown");
        }
      });
    });
  });

  it("update a card that exist should be successfull", (done) => {
    const request = {
      type: "update",
      data: ["testUser", 1, "cardName", "Red"],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      handler.addCard(
        {
          id: 1,
          name: "cardName",
          manaCost: 2,
          color: Color.Blue,
          lineType: TypeLine.Creature,
          rarity: Rarity.Mythical,
          ruleText: "rule",
          strength: 3,
          endurance: 4,
          brandsLoyalty: 5,
          marketValue: 6,
        },
        (error) => {
          messageHandler(JSON.stringify(request), (error, response) => {
            if (error) {
              done(error);
            } else {
              expect(response).to.equal(
                chalk.green.bold("Card updated successfully"),
              );
              done();
            }
          });
        },
      );
    });
  });

  it("update a card that do not exist should return an error", (done) => {
    const request = {
      type: "update",
      data: [
        "testUser",
        1,
        "cardName",
        2,
        "red",
        "Creature",
        "Common",
        "rule",
        3,
        4,
        5,
        6,
      ],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      messageHandler(JSON.stringify(request), (error, response) => {
        if (error) {
          expect(error.message).to.equal(
            chalk.red.bold("Collection not found"),
          );
          done();
        } else {
          done("Error not thrown");
        }
      });
    });
  });

  it("list all cards should return all cards", (done) => {
    const request = {
      type: "list",
      data: ["testUser"],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      handler.addCard(
        {
          id: 1,
          name: "cardName",
          manaCost: 2,
          color: Color.Blue,
          lineType: TypeLine.Creature,
          rarity: Rarity.Mythical,
          ruleText: "rule",
          strength: 3,
          endurance: 4,
          brandsLoyalty: 5,
          marketValue: 6,
        },
        (error) => {
          messageHandler(JSON.stringify(request), (error, response) => {
            if (error) {
              done(error);
            } else {
              done();
            }
          });
        },
      );
    });
  });

  it("list all cards from a collection that do not exist should return an error", (done) => {
    const request = {
      type: "list",
      data: ["testUser"],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      messageHandler(JSON.stringify(request), (error, response) => {
        if (error) {
          expect(error.message).to.equal(
            chalk.red.bold("Collection not found"),
          );
          done();
        } else {
          done("Error not thrown");
        }
      });
    });
  });

  it("update card with invalid color should return an error", (done) => {
    const request = {
      type: "update",
      data: ["testUser", 1, "cardName", "InvalidColor", "color"],
    };

    const handler = new CardCollectionsHandlerAsync("testUser");
    handler.clearCollection((error) => {
      handler.addCard(
        {
          id: 1,
          name: "cardName",
          manaCost: 2,
          color: Color.Blue,
          lineType: TypeLine.Creature,
          rarity: Rarity.Mythical,
          ruleText: "rule",
          strength: 3,
          endurance: 4,
          brandsLoyalty: 5,
          marketValue: 6,
        },
        (error) => {
          messageHandler(JSON.stringify(request), (error, response) => {
            if (error) {
              expect(error.message).to.equal(chalk.red.bold("Invalid color"));
              done();
            } else {
              done("Error not thrown");
            }
          });
        },
      );
    });
  });
  // FIN
});
