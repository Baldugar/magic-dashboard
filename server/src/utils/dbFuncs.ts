import { aql, Database } from "arangojs";
import { DocumentCollection, EdgeCollection } from "arangojs/collection";
import { ArrayCursor } from "arangojs/cursor";
import {
  CategoryType,
  GetUserCardsParams,
  LoginInput,
  MTGACard_User,
  RemoveTagLinkInput,
  Tag,
  TagInput,
  TagLinkInput,
  UpdateUserCardMetaInput,
  User,
  UserTag,
} from "../graphql/types";
import { ADMIN, USER } from "./constants";
import { MTGACard_DB } from "./dbTypes";
import { v4 as uuid } from "uuid";
import { ArangoUser } from "arangojs/database";
import md5 from "md5";

const ensureCollectionExists = async (
  collectionName: string
): Promise<DocumentCollection> =>
  new Promise(async (resolve) => {
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });
    let collection: DocumentCollection = db.collection(collectionName);
    if (!collection) {
      collection = await db.createCollection(collectionName);
    }
    resolve(collection);
  });

// QUERIES

const getCards = async () =>
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
        console.log("resolved to", cards.length);
        resolve(cards);
      });
    });
  });

const getTags = async () =>
  new Promise(async (resolve) => {
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });
    await ensureCollectionExists(USER.collections.document.tags);
    const query = aql`
           Let CardTags = (
             FOR tag IN tags
               FILTER tag.categoryType == "CARD"
                RETURN MERGE(tag, {id: tag._key})
           )

           Let DeckTags = (
              FOR tag IN tags
                FILTER tag.categoryType == "DECK"
                RETURN MERGE(tag, {id: tag._key})
            )

            RETURN MERGE({cardTags: CardTags, deckTags: DeckTags})
        `;
    const cursor = await db.query(query);
    const response = await cursor.next();
    resolve(response);
  });

const getUserCardsQuery = (userID: string) => aql`
          FOR card IN cards
            FOR link IN userCardLink
              FILTER link._from == ${
                USER.collections.document.users + "/" + userID
              } AND link._to == card._id
                LET userCardTags = (
                    FOR tagLink in cardTagLink
                      FILTER tagLink._to == link._id
                      LET tag = (
                        FOR tag in tags
                          FILTER tag._id == tagLink._from
                        RETURN merge(tag, {id: tag._key})
                      )[0]
                    return merge({tag}, {rating: tagLink.rating, comment: tagLink.comment})
                )
                LET userDeckTags = (
                    FOR tagLink in deckTagLink
                     FILTER tagLink._to == link._id
                      LET tag = (
                        FOR tag in tags
                          FILTER tag._id == tagLink._from AND tagLink._to == link._id
                        RETURN merge(tag, {id: tag._key})
                      )[0]
                    return merge({tag}, {rating: tagLink.rating, comment: tagLink.comment})
                )
          return merge ({card}, {rating: link.rating, comment: link.comment, userCardTags, userDeckTags})
        `;

const getUserCards = async (_: any, input: { input: GetUserCardsParams }) =>
  new Promise(async (resolve) => {
    const { userID } = input.input;
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });

    const cursor = await db.query(getUserCardsQuery(userID));
    const response = await cursor.all();
    resolve(response);
  });

// MUTATIONS
const addTag = async (_: any, { tag }: { tag: TagInput }) =>
  new Promise<Tag>(async (resolve) => {
    let collection = await ensureCollectionExists(
      USER.collections.document.tags
    );
    const id = uuid();
    const tagToAdd: Omit<Tag, "id"> & { _key: string } = {
      categoryType: tag.categoryType,
      colors: tag.colors,
      extra: tag.extra,
      type: tag.name,
      _key: id,
    };
    const meta = await collection.save(tagToAdd);
    resolve({
      ...tagToAdd,
      id: meta._key,
    });
  });

const getSingleUserCardQuery = (cardID: string, userID: string) => aql`
          FOR card IN cards
            FILTER card._key == ${cardID}
            FOR link IN userCardLink
              FILTER link._from == ${
                USER.collections.document.users + "/" + userID
              } AND link._to == card._id
                LET userCardTags = (
                    FOR tagLink in cardTagLink
                      FILTER tagLink._to == link._id
                      LET tag = (
                        FOR tag in tags
                          FILTER tag._id == tagLink._from
                        RETURN merge(tag, {id: tag._key})
                      )[0]
                    return merge({tag}, {rating: tagLink.rating, comment: tagLink.comment})
                )
                LET userDeckTags = (
                    FOR tagLink in deckTagLink
                     FILTER tagLink._to == link._id
                      LET tag = (
                        FOR tag in tags
                          FILTER tag._id == tagLink._from AND tagLink._to == link._id
                        RETURN merge(tag, {id: tag._key})
                      )[0]
                    return merge({tag}, {rating: tagLink.rating, comment: tagLink.comment})
                )
          return merge ({card}, {rating: link.rating, comment: link.comment, userCardTags, userDeckTags})
        `;

const getTagCollectionLinkIDQuery = (
  categoryType: CategoryType,
  tagID: string,
  linkID: string
) =>
  categoryType === CategoryType.CARD
    ? aql`
      FOR link IN cardTagLink
        FILTER link._from == ${
          USER.collections.document.tags + "/" + tagID
        } AND link._to == ${linkID}
        RETURN link._id
    `
    : aql`
      FOR link IN deckTagLink
        FILTER link._from == ${
          USER.collections.document.tags + "/" + tagID
        } AND link._to == ${linkID}
        RETURN link._id
    `;

const addTagLink = async (_: any, { input }: { input: TagLinkInput }) =>
  new Promise<MTGACard_User>(async (resolve) => {
    const { tagID, categoryType, cardID, rating, comment, userID } = input;
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });
    const collection: EdgeCollection = db.collection(
      categoryType === CategoryType.CARD
        ? USER.collections.edges.cardTagLink
        : USER.collections.edges.deckTagLink
    );
    const getCollectionLinkIDQuery = aql`
    FOR link IN userCardLink
      FILTER link._from == ${
        USER.collections.document.users + "/" + userID
      } AND link._to == ${"cards/" + cardID}
      RETURN link._id
  `;
    const cursor = await db.query(getCollectionLinkIDQuery);
    const linkID = await cursor.next();
    if (linkID) {
      await collection.save({
        _from: USER.collections.document.tags + "/" + tagID,
        _to: linkID,
        rating,
        comment,
      });
    }
    const cursor2 = await db.query(getSingleUserCardQuery(cardID, userID));
    const response = await cursor2.next();
    console.log("RESOLVING TO", response);
    resolve(response);
  });

const updateTagLink = async (_: any, { input }: { input: TagLinkInput }) =>
  new Promise<MTGACard_User>(async (resolve) => {
    const { tagID, categoryType, cardID, rating, comment, userID } = input;
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });
    const collectionName =
      categoryType === CategoryType.CARD
        ? USER.collections.edges.cardTagLink
        : USER.collections.edges.deckTagLink;
    const collection: EdgeCollection = db.collection(collectionName);
    const getCollectionLinkIDQuery = aql`
    FOR link IN userCardLink
      FILTER link._from == ${
        USER.collections.document.users + "/" + userID
      } AND link._to == ${"cards/" + cardID}
      RETURN link._id
  `;
    const cursor = await db.query(getCollectionLinkIDQuery);
    const linkID = await cursor.next();
    if (linkID) {
      const cursor2 = await db.query(
        getTagCollectionLinkIDQuery(categoryType, tagID, linkID)
      );
      const tagLinkID = await cursor2.next();
      if (tagLinkID) {
        await collection.update(tagLinkID, {
          rating,
          comment,
        });
      }
    }
    const cursor3 = await db.query(getSingleUserCardQuery(cardID, userID));
    const response = await cursor3.next();
    console.log("RESOLVED TO", response);
    resolve(response);
  });

const login = async (_: any, { input }: { input: LoginInput }) =>
  new Promise<User | null>(async (resolve) => {
    const { username, password } = input;
    if (username.length === 0 || password.length === 0) {
      resolve(null);
      return;
    }
    const db = new Database({
      auth: ADMIN,
      databaseName: USER.database,
    });
    console.log(db);
    let user: { _key: string; username: string; password: string } | undefined =
      undefined;
    console.log("Fetching user");
    const fetchUserQuery = aql`
        FOR user IN users
          FILTER user.username == ${username}
          RETURN user
      `;
    const cursor = await db.query(fetchUserQuery);
    user = await cursor.next();
    if (user) {
      console.log("User found");
      const isPasswordCorrect = md5(password) === user.password;
      if (!isPasswordCorrect) {
        console.log("Password incorrect");
        resolve(null);
        return;
      }
      console.log("Password correct");
      resolve({
        id: user._key,
        name: user.username,
      });
    } else {
      console.log("User not found");
      console.log("Creating user");

      const userID = uuid();
      const userCollection = db.collection(USER.collections.document.users);
      userCollection.save({
        _key: userID,
        username,
        password: md5(password),
      });
      const query = aql`
            FOR card in cards
              INSERT { _from: ${`users/${userID}`}, _to: card._id, rating: 0, comment: ""} INTO userCardLink
            `;
      await db.query(query);
      resolve({
        id: userID,
        name: username,
      });
    }
  });

const updateUserCardMeta = async (
  _: any,
  { input }: { input: UpdateUserCardMetaInput }
) =>
  new Promise<MTGACard_User>(async (resolve) => {
    const { userID, cardID, rating, comment } = input;
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });
    const collection: EdgeCollection = db.collection(
      USER.collections.edges.userCardLink
    );
    const getCollectionLinkIDQuery = aql`
  FOR link IN userCardLink
    FILTER link._from == ${
      USER.collections.document.users + "/" + userID
    } AND link._to == ${"cards/" + cardID}
    RETURN link._id
  `;
    const cursor = await db.query(getCollectionLinkIDQuery);
    const linkID = await cursor.next();
    if (linkID) {
      await collection.update(linkID, {
        rating,
        comment,
      });
    }
    const cursor2 = await db.query(getSingleUserCardQuery(cardID, userID));
    const response = await cursor2.next();
    console.log("RESOLVING TO", response);
    resolve(response);
  });

const removeTagLink = async (
  _: any,
  { input }: { input: RemoveTagLinkInput }
) =>
  new Promise<MTGACard_User>(async (resolve) => {
    const { tagID, categoryType, cardID, userID } = input;
    const db = new Database({
      auth: {
        username: USER.username,
        password: USER.password,
      },
      databaseName: USER.database,
    });
    const collectionName =
      categoryType === CategoryType.CARD
        ? USER.collections.edges.cardTagLink
        : USER.collections.edges.deckTagLink;
    const collection: EdgeCollection = db.collection(collectionName);
    const getCollectionLinkIDQuery = aql`
  FOR link IN userCardLink
    FILTER link._from == ${
      USER.collections.document.users + "/" + userID
    } AND link._to == ${"cards/" + cardID}
    RETURN link._id
  `;
    const cursor = await db.query(getCollectionLinkIDQuery);
    const linkID = await cursor.next();
    console.log("LINK ID", linkID);
    if (linkID) {
      const cursor2 = await db.query(
        getTagCollectionLinkIDQuery(categoryType, tagID, linkID)
      );
      const tagLinkID = await cursor2.next();
      console.log("TAG LINK ID", tagLinkID);
      if (tagLinkID) {
        await collection.remove(tagLinkID);
      }
    }
    const cursor3 = await db.query(getSingleUserCardQuery(cardID, userID));
    const response = await cursor3.next();
    console.log("RESOLVED TO", response);
    resolve(response);
  });

// EXPORTS
export const SchemaResolvers = {
  Query: {
    getCards,
    getTags,
    getUserCards,
  },
  Mutation: {
    addTag,
    login,
    addTagLink,
    updateUserCardMeta,
    updateTagLink,
    removeTagLink,
  },
};
