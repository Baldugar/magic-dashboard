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

export type AllPart = {
    __typename?: 'AllPart'
    component: Component
    id: Scalars['ID']
    name: Scalars['String']
    object: AllPartObject
    typeLine: Scalars['String']
    uri: Scalars['String']
}

export enum AllPartObject {
    RELATEDCARD = 'RelatedCard',
}

export type CardById_QueryResponse = {
    __typename?: 'CardByID_QueryResponse'
    result: QueryResponse
    data?: Maybe<MtgaCard>
}

export type CardCategory = {
    __typename?: 'CardCategory'
    type: CategoryType
    colors: Array<Color>
    name: Scalars['String']
    description?: Maybe<Scalars['String']>
    cardsInCategory: Array<MtgaCard>
}

export type CardFace = {
    __typename?: 'CardFace'
    artist: Scalars['String']
    artistID: Scalars['ID']
    colorIndicator?: Maybe<Array<Color>>
    colors?: Maybe<Array<Color>>
    flavorName?: Maybe<Scalars['String']>
    flavorText?: Maybe<Scalars['String']>
    illustrationID?: Maybe<Scalars['ID']>
    imageUris?: Maybe<ImageUris>
    loyalty?: Maybe<Scalars['String']>
    manaCost: Scalars['String']
    name: Scalars['String']
    object: CardFaceObject
    oracleText: Scalars['String']
    power?: Maybe<Scalars['String']>
    toughness?: Maybe<Scalars['String']>
    typeLine?: Maybe<Scalars['String']>
}

export enum CardFaceObject {
    CARDFACE = 'CardFace',
}

export type CardInCollection = {
    __typename?: 'CardInCollection'
    card: MtgaCard
    amount: Scalars['Int']
}

export type CardInCollectionInput = {
    cardId: Scalars['ID']
    userID: Scalars['ID']
}

export type CardSearchInput = {
    searchTerm?: Maybe<Scalars['String']>
}

export type CardsInCollection_QueryResponse = {
    __typename?: 'CardsInCollection_QueryResponse'
    result: QueryResponse
    data: Array<CardInCollection>
}

export enum CategoryType {
    DECK = 'Deck',
    CARD = 'Card',
}

export enum Color {
    WHITE = 'White',
    BLUE = 'Blue',
    BLACK = 'Black',
    RED = 'Red',
    GREEN = 'Green',
    COLORLESS = 'Colorless',
}

export type CompleteUser = {
    __typename?: 'CompleteUser'
    ID: Scalars['ID']
    email: Scalars['String']
    decks: Array<MtgaDeck>
    cardsInCollection: Array<CardInCollection>
    cardCategories: Array<CardCategory>
}

export enum Component {
    COMBOPIECE = 'ComboPiece',
    TOKEN = 'Token',
}

export type CreateCardCategoryInput = {
    type: CategoryType
    colors: Array<Color>
    name: Scalars['String']
    description?: Maybe<Scalars['String']>
}

export type CreateDeckInput = {
    name: Scalars['String']
    description: Scalars['String']
    userID: Scalars['ID']
}

export type DeckById_QueryResponse = {
    __typename?: 'DeckByID_QueryResponse'
    result: QueryResponse
    data?: Maybe<MtgaDeck>
}

export type DeckSearchInput = {
    searchTerm?: Maybe<Scalars['String']>
}

export type DuplicateDeckInput = {
    oldDeckID: Scalars['ID']
    newDeckData: CreateDeckInput
}

export enum Finish {
    ETCHED = 'Etched',
    FOIL = 'Foil',
    NONFOIL = 'Nonfoil',
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

export enum Keywords {
    ADAMANT = 'ADAMANT',
    ADAPT = 'ADAPT',
    ADDENDUM = 'ADDENDUM',
    AFFINITY = 'AFFINITY',
    AFFLICT = 'AFFLICT',
    AFTERLIFE = 'AFTERLIFE',
    AFTERMATH = 'AFTERMATH',
    AMASS = 'AMASS',
    BATTALION = 'BATTALION',
    BOAST = 'BOAST',
    CASCADE = 'CASCADE',
    CHANGELING = 'CHANGELING',
    CHANNEL = 'CHANNEL',
    CLEAVE = 'CLEAVE',
    COMPANION = 'COMPANION',
    CONJURE = 'CONJURE',
    CONSTELLATION = 'CONSTELLATION',
    CONVOKE = 'CONVOKE',
    COVEN = 'COVEN',
    CREW = 'CREW',
    CYCLING = 'CYCLING',
    DAYBOUND = 'DAYBOUND',
    DEATHTOUCH = 'DEATHTOUCH',
    DEFENDER = 'DEFENDER',
    DELIRIUM = 'DELIRIUM',
    DISTURB = 'DISTURB',
    DOMAIN = 'DOMAIN',
    DOUBLE_STRIKE = 'DOUBLE_STRIKE',
    ECHO = 'ECHO',
    EMBALM = 'EMBALM',
    ENCHANT = 'ENCHANT',
    ENRAGE = 'ENRAGE',
    EQUIP = 'EQUIP',
    ESCAPE = 'ESCAPE',
    ETERNALIZE = 'ETERNALIZE',
    EVOKE = 'EVOKE',
    EVOLVE = 'EVOLVE',
    EXERT = 'EXERT',
    EXPLOIT = 'EXPLOIT',
    EXPLORE = 'EXPLORE',
    FABRICATE = 'FABRICATE',
    FEAR = 'FEAR',
    FIGHT = 'FIGHT',
    FIRST_STRIKE = 'FIRST_STRIKE',
    FLASH = 'FLASH',
    FLASHBACK = 'FLASHBACK',
    FLYING = 'FLYING',
    FORESTWALK = 'FORESTWALK',
    FORETELL = 'FORETELL',
    HASTE = 'HASTE',
    HELLBENT = 'HELLBENT',
    HEXPROOF = 'HEXPROOF',
    HEXPROOF_FROM = 'HEXPROOF_FROM',
    IMPROVISE = 'IMPROVISE',
    INDESTRUCTIBLE = 'INDESTRUCTIBLE',
    INTENSITY = 'INTENSITY',
    INVESTIGATE = 'INVESTIGATE',
    JUMP_START = 'JUMP_START',
    KICKER = 'KICKER',
    LANDFALL = 'LANDFALL',
    LANDWALK = 'LANDWALK',
    LEARN = 'LEARN',
    LIFELINK = 'LIFELINK',
    LIVING_WEAPON = 'LIVING_WEAPON',
    MADNESS = 'MADNESS',
    MAGECRAFT = 'MAGECRAFT',
    MENACE = 'MENACE',
    MENTOR = 'MENTOR',
    MILL = 'MILL',
    MODULAR = 'MODULAR',
    MORBID = 'MORBID',
    MUTATE = 'MUTATE',
    NIGHTBOUND = 'NIGHTBOUND',
    NINJUTSU = 'NINJUTSU',
    OUTLAST = 'OUTLAST',
    OVERLOAD = 'OVERLOAD',
    PACK_TACTICS = 'PACK_TACTICS',
    PERSIST = 'PERSIST',
    PROLIFERATE = 'PROLIFERATE',
    PROTECTION = 'PROTECTION',
    PROWESS = 'PROWESS',
    RAID = 'RAID',
    REACH = 'REACH',
    REBOUND = 'REBOUND',
    RECONFIGURE = 'RECONFIGURE',
    REINFORCE = 'REINFORCE',
    RETRACE = 'RETRACE',
    REVOLT = 'REVOLT',
    RIOT = 'RIOT',
    SCAVENGE = 'SCAVENGE',
    SCRY = 'SCRY',
    SEEK = 'SEEK',
    SPECTACLE = 'SPECTACLE',
    SPLIT_SECOND = 'SPLIT_SECOND',
    STORM = 'STORM',
    SUPPORT = 'SUPPORT',
    SURVEIL = 'SURVEIL',
    SWAMPWALK = 'SWAMPWALK',
    THRESHOLD = 'THRESHOLD',
    TRAINING = 'TRAINING',
    TRAMPLE = 'TRAMPLE',
    TRANSFORM = 'TRANSFORM',
    UNDERGROWTH = 'UNDERGROWTH',
    UNEARTH = 'UNEARTH',
    VIGILANCE = 'VIGILANCE',
    WARD = 'WARD',
}

export enum Lang {
    EN = 'En',
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
    allParts?: Maybe<Array<AllPart>>
    artist: Scalars['String']
    artistIDS: Array<Scalars['String']>
    booster: Scalars['Boolean']
    cardBackID?: Maybe<Scalars['ID']>
    cardFaces?: Maybe<Array<CardFace>>
    cmc: Scalars['Int']
    collectorNumber: Scalars['String']
    colorIdentity: Array<Color>
    colors?: Maybe<Array<Color>>
    digital: Scalars['Boolean']
    finishes: Array<Finish>
    flavorText?: Maybe<Scalars['String']>
    foil: Scalars['Boolean']
    id: Scalars['ID']
    imageUris?: Maybe<ImageUris>
    keywords: Array<Keywords>
    lang: Lang
    layout: Layout
    legalities: Legalities
    loyalty?: Maybe<Scalars['String']>
    manaCost?: Maybe<Scalars['String']>
    multiverseIDS: Array<Scalars['ID']>
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
    setType: SetType
    setURI: Scalars['String']
    toughness?: Maybe<Scalars['String']>
    typeLine: Scalars['String']
}

export type MtgaDeck = {
    __typename?: 'MTGADeck'
    id: Scalars['ID']
    name: Scalars['String']
    description: Scalars['String']
    colors: Array<Color>
    cards: Array<MtgaCard>
    user: CompleteUser
    createdAt: Scalars['Time']
    updatedAt: Scalars['Time']
}

export type MtgaDeckDb = {
    __typename?: 'MTGADeckDB'
    id: Scalars['ID']
    name: Scalars['String']
    cards: Array<Scalars['ID']>
    userID: Scalars['ID']
    createdAt: Scalars['Time']
    updatedAt: Scalars['Time']
}

export type MultipleCards_QueryResponse = {
    __typename?: 'MultipleCards_QueryResponse'
    result: QueryResponse
    data: Array<MtgaCard>
}

export type MultipleDecks_QueryResponse = {
    __typename?: 'MultipleDecks_QueryResponse'
    result: QueryResponse
    data: Array<MtgaDeck>
}

export type Mutation = {
    __typename?: 'Mutation'
    AddCardToCollection: MutationResponse
    RemoveCardFromCollection: MutationResponse
    CreateDeck: MutationResponse
    DeleteDeck: MutationResponse
    DuplicateDeck: MutationResponse
    CreateCategory: QueryResponse
}

export type MutationAddCardToCollectionArgs = {
    input: CardInCollectionInput
}

export type MutationRemoveCardFromCollectionArgs = {
    input: CardInCollectionInput
}

export type MutationCreateDeckArgs = {
    input: CreateDeckInput
}

export type MutationDeleteDeckArgs = {
    deckID: Scalars['ID']
}

export type MutationDuplicateDeckArgs = {
    input: DuplicateDeckInput
}

export type MutationCreateCategoryArgs = {
    input: CreateCardCategoryInput
}

export type MutationResponse = {
    __typename?: 'MutationResponse'
    success: Scalars['Boolean']
    message?: Maybe<Scalars['String']>
}

export type Query = {
    __typename?: 'Query'
    AllCards: MultipleCards_QueryResponse
    CardByID: CardById_QueryResponse
    SearchCards: MultipleCards_QueryResponse
    CardsInCollection: CardsInCollection_QueryResponse
    AllDecks: MultipleDecks_QueryResponse
    DeckByID: DeckById_QueryResponse
    SearchDecks: MultipleDecks_QueryResponse
    UserByID: UserById_QueryResponse
}

export type QueryCardByIdArgs = {
    id: Scalars['ID']
}

export type QuerySearchCardsArgs = {
    input: CardSearchInput
}

export type QueryCardsInCollectionArgs = {
    userID: Scalars['ID']
}

export type QueryDeckByIdArgs = {
    id: Scalars['ID']
}

export type QuerySearchDecksArgs = {
    input: DeckSearchInput
}

export type QueryUserByIdArgs = {
    id: Scalars['ID']
}

export type QueryResponse = {
    __typename?: 'QueryResponse'
    success: Scalars['Boolean']
    message?: Maybe<Scalars['String']>
}

export enum Rarity {
    COMMON = 'Common',
    UNCOMMON = 'Uncommon',
    RARE = 'Rare',
    MYTHIC = 'Mythic',
}

export type SaveDeckInput = {
    deckID: Scalars['ID']
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

export enum SetType {
    ALCHEMY = 'Alchemy',
    BOX = 'Box',
    CORE = 'Core',
    DRAFTINNOVATION = 'DraftInnovation',
    EXPANSION = 'Expansion',
    MASTERPIECE = 'Masterpiece',
    MASTERS = 'Masters',
    PROMO = 'Promo',
    STARTER = 'Starter',
}

export type UserById_QueryResponse = {
    __typename?: 'UserByID_QueryResponse'
    result: QueryResponse
    data?: Maybe<CompleteUser>
}
