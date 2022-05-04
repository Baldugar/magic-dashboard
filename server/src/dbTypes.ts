import { Maybe } from "graphql/jsutils/Maybe";
import {
  CardFace,
  Scalars,
  Color,
  ImageUris,
  Layout,
  Legalities,
  Rarity,
  Set,
} from "./graphql/types";

export interface MTGACard_DB {
  __typename?: "MTGACard";
  _key: Scalars["ID"];
  id: Scalars["ID"];
  card_faces?: Maybe<Array<CardFace>>;
  cmc: Scalars["Int"];
  color_identity: Array<Color>;
  colors?: Maybe<Array<Color>>;
  flavor_text?: Maybe<Scalars["String"]>;
  image_uris?: Maybe<ImageUris>;
  layout: Layout;
  legalities: Legalities;
  loyalty?: Maybe<Scalars["String"]>;
  mana_cost?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  oracle_text?: Maybe<Scalars["String"]>;
  power?: Maybe<Scalars["String"]>;
  produced_mana?: Maybe<Array<Color>>;
  rarity: Rarity;
  released_at: Scalars["String"];
  rulings_uri: Scalars["String"];
  scryfall_uri: Scalars["String"];
  set: Set;
  set_name: Scalars["String"];
  set_uri: Scalars["String"];
  toughness?: Maybe<Scalars["String"]>;
  type_line: Scalars["String"];
}
