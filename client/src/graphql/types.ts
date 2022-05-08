export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

export type CardFace = {
    __typename?: 'CardFace'
    color_indicator?: Maybe<Array<Color>>
    colors?: Maybe<Array<Color>>
    flavor_text?: Maybe<Scalars['String']>
    image_uris?: Maybe<ImageUris>
    loyalty?: Maybe<Scalars['String']>
    mana_cost: Scalars['String']
    name: Scalars['String']
    oracle_text: Scalars['String']
    power?: Maybe<Scalars['String']>
    toughness?: Maybe<Scalars['String']>
    type_line?: Maybe<Scalars['String']>
}

export enum CardType {
    artifact = 'artifact',
    creature = 'creature',
    enchantment = 'enchantment',
    instant = 'instant',
    land = 'land',
    planeswalker = 'planeswalker',
    sorcery = 'sorcery',
}

export enum CategoryType {
    CARD = 'CARD',
    DECK = 'DECK',
}

export enum Color {
    C = 'C',
    B = 'B',
    G = 'G',
    R = 'R',
    U = 'U',
    W = 'W',
}

export type GetTagsReturn = {
    __typename?: 'GetTagsReturn'
    cardTags: Array<Tag>
    deckTags: Array<Tag>
}

export type GetUserCardsParams = {
    userID: Scalars['ID']
}

export type ImageUris = {
    __typename?: 'ImageUris'
    art_crop: Scalars['String']
    border_crop: Scalars['String']
    large: Scalars['String']
    normal: Scalars['String']
    png: Scalars['String']
    small: Scalars['String']
}

export enum Layout {
    adventure = 'adventure',
    class = 'class',
    modal_dfc = 'modal_dfc',
    normal = 'normal',
    saga = 'saga',
    split = 'split',
    transform = 'transform',
}

export type Legalities = {
    __typename?: 'Legalities'
    alchemy: Legality
    brawl: Legality
    historic: Legality
    historicbrawl: Legality
    standard: Legality
}

export enum Legality {
    banned = 'banned',
    legal = 'legal',
    not_legal = 'not_legal',
    restricted = 'restricted',
}

export type LoginInput = {
    password: Scalars['String']
    username: Scalars['String']
}

export type MTGACard = {
    __typename?: 'MTGACard'
    card_faces?: Maybe<Array<CardFace>>
    cmc: Scalars['Int']
    color_identity: Array<Color>
    colors?: Maybe<Array<Color>>
    flavor_text?: Maybe<Scalars['String']>
    id: Scalars['ID']
    image_uris?: Maybe<ImageUris>
    layout: Layout
    legalities: Legalities
    loyalty?: Maybe<Scalars['String']>
    mana_cost?: Maybe<Scalars['String']>
    name: Scalars['String']
    oracle_text?: Maybe<Scalars['String']>
    power?: Maybe<Scalars['String']>
    produced_mana?: Maybe<Array<Color>>
    rarity: Rarity
    released_at: Scalars['String']
    rulings_uri: Scalars['String']
    scryfall_uri: Scalars['String']
    set: Set
    set_name: Scalars['String']
    set_uri: Scalars['String']
    toughness?: Maybe<Scalars['String']>
    type_line: Scalars['String']
}

export type MTGACard_User = {
    __typename?: 'MTGACard_User'
    card: MTGACard
    comment: Scalars['String']
    rating: Scalars['Int']
    userCardTags: Array<UserTag>
    userDeckTags: Array<UserTag>
}

export type Mutation = {
    __typename?: 'Mutation'
    addTag: Tag
    addTagLink: MTGACard_User
    login?: Maybe<User>
    removeTagLink: MTGACard_User
    updateTagLink: MTGACard_User
    updateUserCardMeta: MTGACard_User
}

export type MutationaddTagArgs = {
    tag: TagInput
}

export type MutationaddTagLinkArgs = {
    input: TagLinkInput
}

export type MutationloginArgs = {
    input: LoginInput
}

export type MutationremoveTagLinkArgs = {
    input: RemoveTagLinkInput
}

export type MutationupdateTagLinkArgs = {
    input: TagLinkInput
}

export type MutationupdateUserCardMetaArgs = {
    input: UpdateUserCardMetaInput
}

export type Query = {
    __typename?: 'Query'
    getCards: Array<MTGACard>
    getTags: GetTagsReturn
    getUserCards: Array<MTGACard_User>
}

export type QuerygetUserCardsArgs = {
    input: GetUserCardsParams
}

export enum Rarity {
    common = 'common',
    uncommon = 'uncommon',
    rare = 'rare',
    mythic = 'mythic',
}

export type RemoveTagLinkInput = {
    cardID: Scalars['ID']
    categoryType: CategoryType
    tagID: Scalars['ID']
    userID: Scalars['ID']
}

export enum Set {
    afr = 'afr',
    ajmp = 'ajmp',
    akr = 'akr',
    anb = 'anb',
    dom = 'dom',
    eld = 'eld',
    g18 = 'g18',
    grn = 'grn',
    ha1 = 'ha1',
    ha2 = 'ha2',
    ha3 = 'ha3',
    ha4 = 'ha4',
    ha5 = 'ha5',
    iko = 'iko',
    j21 = 'j21',
    jmp = 'jmp',
    khm = 'khm',
    klr = 'klr',
    m19 = 'm19',
    m20 = 'm20',
    m21 = 'm21',
    mid = 'mid',
    neo = 'neo',
    oana = 'oana',
    pana = 'pana',
    rix = 'rix',
    rna = 'rna',
    snc = 'snc',
    sta = 'sta',
    stx = 'stx',
    thb = 'thb',
    vow = 'vow',
    war = 'war',
    xln = 'xln',
    ymid = 'ymid',
    yneo = 'yneo',
    znr = 'znr',
}

export type Tag = {
    __typename?: 'Tag'
    categoryType: CategoryType
    colors: Array<Color>
    extra: Scalars['String']
    id: Scalars['ID']
    type: Scalars['String']
}

export type TagInput = {
    categoryType: CategoryType
    colors: Array<Color>
    extra: Scalars['String']
    name: Scalars['String']
}

export type TagLinkInput = {
    cardID: Scalars['ID']
    categoryType: CategoryType
    comment: Scalars['String']
    rating: Scalars['Int']
    tagID: Scalars['ID']
    userID: Scalars['ID']
}

export type UpdateUserCardMetaInput = {
    cardID: Scalars['ID']
    comment: Scalars['String']
    rating: Scalars['Int']
    userID: Scalars['ID']
}

export type User = {
    __typename?: 'User'
    id: Scalars['ID']
    name: Scalars['String']
}

export type UserTag = {
    __typename?: 'UserTag'
    comment: Scalars['String']
    rating: Scalars['Int']
    tag: Tag
}
