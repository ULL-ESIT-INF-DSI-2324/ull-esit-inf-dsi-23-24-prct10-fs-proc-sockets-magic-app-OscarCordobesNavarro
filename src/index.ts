import { CardCollectionsHandlerAsync } from "./Previo/CardCollectionsHandler.js";
import { Color } from "./Previo/IColor.js";
import { ICard } from "./Previo/ICard.js";
import { Rarity } from "./Previo/IRarity.js";
import { TypeLine } from "./Previo/ITypeLine.js";


const handler = new CardCollectionsHandlerAsync("oscar");
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

handler.addCard(carta, (error) => {
    if (error) {
        console.log("Error al añadir carta:", error);
        return;
    }
    console.log("Carta añadida:");
});