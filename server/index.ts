import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { CollectionType, Database } from "arangojs";
import { AccessLevel, ArangoUser } from "arangojs/database";
import axios from "axios";
import { format } from "date-fns";
import { TagInput } from "./src/graphql/types";
import { ADMIN, mtgaQuery, USER } from "./src/utils/constants";
import { SchemaResolvers } from "./src/utils/dbFuncs";
import { MTGACard_DB, TagCardLink } from "./src/utils/dbTypes";
import { convertToMTGACard, fetchCards, readContent } from "./src/utils/funcs";

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.

readContent(
  "../graphql/schema.graphqls",
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
      await db.setUserAccessLevel(user.user, {
        database: USER.database,
        grant: "rw",
      });
      const createCollections = async (
        colls: { col: string; type: CollectionType }[]
      ) =>
        await Promise.all(
          colls.map(async (coll) => {
            console.log("Creating collection", coll);
            if (coll.type === CollectionType.DOCUMENT_COLLECTION) {
              return await db.createCollection(coll.col);
            } else {
              return await db.createEdgeCollection(coll.col);
            }
          })
        );
      await createCollections([
        {
          col: USER.collections.document.cards,
          type: CollectionType.DOCUMENT_COLLECTION,
        },
        {
          col: USER.collections.document.tags,
          type: CollectionType.DOCUMENT_COLLECTION,
        },
        {
          col: USER.collections.document.users,
          type: CollectionType.DOCUMENT_COLLECTION,
        },
        {
          col: USER.collections.edges.cardTagLink,
          type: CollectionType.EDGE_COLLECTION,
        },
        {
          col: USER.collections.edges.deckTagLink,
          type: CollectionType.EDGE_COLLECTION,
        },
        {
          col: USER.collections.edges.userCardLink,
          type: CollectionType.EDGE_COLLECTION,
        },
        {
          col: USER.collections.meta,
          type: CollectionType.DOCUMENT_COLLECTION,
        },
      ]);
      console.log("Created collections");
      const cardsCollection = db.collection(USER.collections.document.cards);
      console.log("Loaded collection", cardsCollection.name);
      const metaCollection = db.collection(USER.collections.meta);
      console.log("Loaded collection", metaCollection.name);

      const cards = await fetchCards(mtgaQuery, []);
      console.log("Fetched cards", cards.length);
      await cardsCollection.import(
        cards.map((c) => {
          const cToReturn = { ...c, _key: c.id };
          return cToReturn;
        })
      );

      // const response = await axios(mtgaQuery);
      // const data: any = response.data;
      // const cards: MTGACard_DB[] = [...data.data.map(convertToMTGACard)];
      // await cardsCollection.import(
      //   cards.map((c) => {
      //     const cToReturn = { ...c, _key: c.id };
      //     return cToReturn;
      //   })
      // );

      console.log("Imported cards");
      await metaCollection.save({
        _key: "lastUpdate",
        lastUpdated: new Date().getTime(),
      });
      console.log("Saved meta");
    } else {
      console.log("Database exists");
      const newDb = new Database({
        auth: {
          username: USER.username,
          password: USER.password,
        },
        databaseName: USER.database,
      });
      const metaCol = newDb.collection<{ lastUpdate: number }>(
        USER.collections.meta
      );
      const meta = await metaCol.document("lastUpdate");
      console.log("meta", meta);
      if (meta.lastUpdate < new Date().getTime()) {
        console.log("Updating database");
        const updateQuery =
          mtgaQuery + "+and+date>%3D" + format(meta.lastUpdate, "yyyy-MM-dd");
        console.log("Fetching cards", updateQuery);
        try {
          const cards = await fetchCards(updateQuery, []);
          console.log("Fetched cards", cards.length);
          const coll = newDb.collection<MTGACard_DB>(
            USER.collections.document.cards
          );
          await coll.import(
            cards.map((c) => {
              const cToReturn = { ...c, _key: c.id };
              return cToReturn;
            })
          );
          console.log("Imported cards");
        } catch (reason) {
          if (JSON.stringify(reason).includes("match any cards")) {
            console.log("No new cards");
          }
        }
        await metaCol.update("lastUpdate", {
          lastUpdate: new Date().getTime(),
        });
        console.log("Saved meta");
        console.log("Done updating");
        newDb.close();
      }
    }
    console.log("Done");
    db.close();

    const schema = makeExecutableSchema({
      typeDefs: content,
      resolvers: SchemaResolvers,
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
