import axios from "axios";
import * as fs from "fs";
import { MTGACard, Color, Layout, ImageUris, Set } from "../graphql/types";

export const convertToMTGACard = (card: any): MTGACard => ({
  id: card.id,
  name: card.name,
  cmc: card.cmc,
  color_identity:
    card.color_identity.length === 0
      ? [Color.C]
      : (card.color_identity as Color[]),
  layout: card.layout as Layout,
  mana_cost: card.mana_cost,
  type_line: card.type_line,
  oracle_text: card.oracle_text,
  power: card.power,
  toughness: card.toughness,
  loyalty: card.loyalty,
  legalities: {
    alchemy: card.legalities.alchemy,
    brawl: card.legalities.brawl,
    historic: card.legalities.historic,
    historicbrawl: card.legalities.historicbrawl,
    standard: card.legalities.standard,
  },
  rarity: card.rarity,
  released_at: card.released_at,
  set_name: card.set_name,
  rulings_uri: card.rulings_uri,
  set_uri: card.set_uri,
  set: card.set as Set,
  scryfall_uri: card.scryfall_uri,
  card_faces: card.card_faces
    ? card.card_faces.map((c: any) => ({
        color_indicator: c.color_indicator,
        colors: c.colors,
        flavor_text: c.flavor_text,
        image_uris: c.image_uris
          ? ({
              art_crop: c.image_uris.art_crop,
              border_crop: c.image_uris.border_crop,
              large: c.image_uris.large,
              normal: c.image_uris.normal,
              png: c.image_uris.png,
              small: c.image_uris.small,
            } as ImageUris)
          : undefined,
        loyalty: c.loyalty,
        mana_cost: c.mana_cost,
        name: c.name,
        oracle_text: c.oracle_text,
        power: c.power,
        toughness: c.toughness,
        type_line: c.type_line,
      }))
    : undefined,
  colors: card.colors,
  flavor_text: card.flavor_text,
  produced_mana: card.produced_mana,
  image_uris: card.image_uris
    ? {
        art_crop: card.image_uris.art_crop,
        border_crop: card.image_uris.border_crop,
        large: card.image_uris.large,
        normal: card.image_uris.normal,
        png: card.image_uris.png,
        small: card.image_uris.small,
      }
    : undefined,
});

export const fetchCards = async (
  query: string,
  currentCards: MTGACard[]
): Promise<MTGACard[]> => {
  const response = await axios(query);
  console.log("RESPONSE", response);
  const data: any = response.data;
  console.log("DATA", data);
  const cards: MTGACard[] = [
    ...currentCards,
    ...data.data.map(convertToMTGACard),
  ];
  if (data.has_more) {
    return fetchCards(data.next_page, cards);
  }
  return cards;
};

export function readContent(
  file: string,
  callback: (err: NodeJS.ErrnoException | null, data?: string) => void
) {
  fs.readFile(file, "utf8", (err: any, content: any) => {
    if (err) return callback(err);
    callback(null, content);
  });
}
