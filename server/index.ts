import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import * as fs from "fs";
import { Color, ImageUris, Layout, MTGACard, Set } from "./src/graphql/types";
import { Database, aql } from "arangojs";
import { AccessLevel, ArangoUser } from "arangojs/database";
import { ArrayCursor } from "arangojs/cursor";
import { MTGACard_DB } from "./src/dbTypes";
import axios from "axios";

const mtgaQuery = "https://api.scryfall.com/cards/search?q=game%3Aarena";

const convertToMTGACard = (card: any): MTGACard => ({
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

const ADMIN = {
  username: "root",
  password: "arangodb",
};

const USER = {
  username: "magic-dashboard-user",
  password: "arangodb",
  database: "magic-dashboard",
  collections: {
    cards: "cards",
  },
};

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

function readContent(
  file: string,
  callback: (err: NodeJS.ErrnoException | null, data?: string) => void
) {
  fs.readFile(file, "utf8", (err: any, content: any) => {
    if (err) return callback(err);
    callback(null, content);
  });
}

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

const resolvers = {
  Query: {
    getCards: async () =>
      new Promise((resolve) => {
        const db = new Database({
          auth: {
            username: USER.username,
            password: USER.password,
          },
          databaseName: USER.database,
        });
        const query = aql`
        FOR card IN cards
        RETURN card`;
        db.query(query).then((cursor: ArrayCursor<MTGACard_DB>) => {
          cursor.all().then((cards: MTGACard_DB[]) => {
            resolve(cards);
          });
        });
      }),
  },
};

readContent(
  "../graphql/card_schema.graphqls",
  async (error: any, content: string | undefined) => {
    if (error || content === undefined) throw error;

    let db = new Database({
      auth: ADMIN,
    });
    let user: ArangoUser | undefined = undefined;
    try {
      console.log("Fetching user");
      // @ts-ignore
      user = (await db.getUser(USER.username)).body as ArangoUser;
      console.log("Fetched user", user.user);
    } catch (reason: any) {
      if (reason.toString().includes("user not found")) {
        console.log("Creating user");
        user = await db.createUser(USER.username, USER.password);
        console.log("Created user", user.user);
      } else {
        throw reason;
      }
    }
    let userDatabases: Record<string, AccessLevel> = {};
    try {
      console.log("Getting user database");
      userDatabases = // @ts-ignore
        (await db.getUserDatabases(user.user)).body.result as Record<
          string,
          AccessLevel
        >;
      console.log("Got user databases", userDatabases);
    } catch (reason: any) {
      console.log("Getting user databases failed");
    }
    if (!userDatabases[USER.database]) {
      console.log("Creating database");
      db = await db.createDatabase(USER.database);
      console.log("Created database");
      db.setUserAccessLevel(user.user, {
        database: USER.database,
        grant: "rw",
      });
      const coll = await db.createCollection<MTGACard_DB>(
        USER.collections.cards
      );
      const cards = await fetchCards(mtgaQuery, []);
      await coll.import(
        cards.map((c) => {
          const cToReturn = { ...c, _key: c.id };
          return cToReturn;
        })
      );
      console.log("Collection created", coll.name);
    }
    db.close();

    const schema = makeExecutableSchema({
      typeDefs: content,
      resolvers,
    });

    const server = new ApolloServer({
      schema,
      mocks: false,
    });

    server
      .listen({
        port: 8000,
      })
      .then(({ url }) => {
        console.log(`Server ready at ${url}.`);
      });
  }
);
