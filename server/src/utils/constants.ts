export const mtgaQuery = "https://api.scryfall.com/cards/search?q=game%3Aarena";

export const ADMIN = {
  username: "root",
  password: "arangodb",
};

export const USER = {
  username: "magic-dashboard-user",
  password: "arangodb",
  database: "magic-dashboard",
  collections: {
    document: {
      cards: "cards",
      tags: "tags",
      users: "users",
    },
    edges: {
      cardTagLink: "cardTagLink",
      deckTagLink: "deckTagLink",
      userCardLink: "userCardLink",
    },
    meta: "meta",
  },
};
