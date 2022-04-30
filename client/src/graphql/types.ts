export type Maybe<T> = T | null
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
    Time: Date
}

export type CardFace = {
    __typename?: 'CardFace'
    colorIndicator?: Maybe<Array<Color>>
    colors?: Maybe<Array<Color>>
    flavorText?: Maybe<Scalars['String']>
    imageUris?: Maybe<ImageUris>
    loyalty?: Maybe<Scalars['String']>
    manaCost: Scalars['String']
    name: Scalars['String']
    oracleText: Scalars['String']
    power?: Maybe<Scalars['String']>
    toughness?: Maybe<Scalars['String']>
    typeLine?: Maybe<Scalars['String']>
}

export enum Color {
    WHITE = 'White',
    BLUE = 'Blue',
    BLACK = 'Black',
    RED = 'Red',
    GREEN = 'Green',
    COLORLESS = 'Colorless',
}

export type ImageUris = {
    __typename?: 'ImageUris'
    small: Scalars['String']
    normal: Scalars['String']
    large: Scalars['String']
    png: Scalars['String']
    artCrop: Scalars['String']
    borderCrop: Scalars['String']
}

export enum Layout {
    ADVENTURE = 'Adventure',
    CLASS = 'Class',
    MODALDFC = 'ModalDfc',
    NORMAL = 'Normal',
    SAGA = 'Saga',
    SPLIT = 'Split',
    TRANSFORM = 'Transform',
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
    BANNED = 'Banned',
    LEGAL = 'Legal',
    NOTLEGAL = 'NotLegal',
    RESTRICTED = 'Restricted',
}

export type MtgaCard = {
    __typename?: 'MTGACard'
    cardFaces?: Maybe<Array<CardFace>>
    cmc: Scalars['Int']
    colorIdentity: Array<Color>
    colors?: Maybe<Array<Color>>
    flavorText?: Maybe<Scalars['String']>
    id: Scalars['ID']
    imageUris?: Maybe<ImageUris>
    layout: Layout
    legalities: Legalities
    loyalty?: Maybe<Scalars['String']>
    manaCost?: Maybe<Scalars['String']>
    name: Scalars['String']
    oracleText?: Maybe<Scalars['String']>
    power?: Maybe<Scalars['String']>
    producedMana?: Maybe<Array<Color>>
    rarity: Rarity
    releasedAt: Scalars['Time']
    rulingsURI: Scalars['String']
    scryfallURI: Scalars['String']
    set: Set
    setName: Scalars['String']
    setURI: Scalars['String']
    toughness?: Maybe<Scalars['String']>
    typeLine: Scalars['String']
}

export type MtgaCard_User = {
    __typename?: 'MTGACard_User'
    card: MtgaCard
    userRating: Scalars['Int']
    userCardTags: Array<UserTag>
    userDeckTags: Array<UserTag>
}

export enum Rarity {
    COMMON = 'Common',
    UNCOMMON = 'Uncommon',
    RARE = 'Rare',
    MYTHIC = 'Mythic',
}

export enum Set {
    AFR = 'Afr',
    AJMP = 'Ajmp',
    AKR = 'Akr',
    ANB = 'Anb',
    DOM = 'DOM',
    ELD = 'Eld',
    G18 = 'G18',
    GRN = 'Grn',
    HA1 = 'Ha1',
    HA2 = 'Ha2',
    HA3 = 'Ha3',
    HA4 = 'Ha4',
    HA5 = 'Ha5',
    IKO = 'Iko',
    J21 = 'J21',
    JMP = 'Jmp',
    KHM = 'Khm',
    KLR = 'Klr',
    M19 = 'M19',
    M20 = 'M20',
    M21 = 'M21',
    MID = 'Mid',
    NEO = 'Neo',
    OANA = 'Oana',
    PANA = 'Pana',
    RIX = 'Rix',
    RNA = 'Rna',
    SNC = 'Snc',
    STA = 'Sta',
    STX = 'Stx',
    THB = 'Thb',
    VOW = 'Vow',
    WAR = 'War',
    XLN = 'Xln',
    YMID = 'Ymid',
    YNEO = 'Yneo',
    ZNR = 'Znr',
}

export type Tag = {
    __typename?: 'Tag'
    id: Scalars['ID']
    mame: Scalars['String']
    colors: Array<Color>
}

export type UserTag = {
    __typename?: 'UserTag'
    tag: Tag
    comment?: Maybe<Scalars['String']>
}
