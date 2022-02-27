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
    SettingsMap: Record<Settings, boolean>
}

export type ApiCard = {
    name: Scalars['String']
    card_faces?: Maybe<Array<ApiCard>>
    image_uris?: Maybe<ImageUri>
    cmc: Scalars['Int']
}

export type ApiCardInput = {
    name: Scalars['String']
    card_faces?: Maybe<Array<ApiCardInput>>
    image_uris?: Maybe<ImageUriInput>
    cmc: Scalars['Int']
}

export type BoardColumn = {
    __typename?: 'BoardColumn'
    name: Scalars['String']
    cards: Array<Card>
}

export type BoardColumnInput = {
    name: Scalars['String']
    cards: Array<CardInput>
}

export type Card = ImportedCard &
    ApiCard & {
        __typename?: 'Card'
        isCommander: Scalars['Boolean']
        isCompanion: Scalars['Boolean']
    }

export type CardInput = {
    name: Scalars['String']
    card_faces?: Maybe<Array<ApiCardInput>>
    image_uris?: Maybe<ImageUriInput>
    cmc: Scalars['Int']
    set: Scalars['String']
    number: Scalars['String']
    numOfCards: Scalars['Int']
    isCommander: Scalars['Boolean']
    isCompanion: Scalars['Boolean']
}

export type ChangeUserDataInput = {
    username?: Maybe<Scalars['String']>
    avatar?: Maybe<Scalars['String']>
}

export type CreateDeckInput = {
    name: Scalars['String']
    image?: Maybe<Scalars['String']>
    format: Format
}

export type Deck = {
    __typename?: 'Deck'
    ID: Scalars['String']
    name: Scalars['String']
    image?: Maybe<Scalars['String']>
    format: Format
    cards: Array<Card>
}

export type DeckBoard = {
    __typename?: 'DeckBoard'
    columns: Array<BoardColumn>
    deckID: Scalars['String']
}

export type DeleteDeckInput = {
    deckID: Scalars['String']
}

export type DuplicateDeckInput = {
    deckID: Scalars['String']
    name: Scalars['String']
}

export enum Format {
    NONE = 'NONE',
    STANDARD = 'STANDARD',
    HISTORIC = 'HISTORIC',
    TRADITIONAL_STANDARD = 'TRADITIONAL_STANDARD',
    BRAWL = 'BRAWL',
    FRIENDLY_BRAWL = 'FRIENDLY_BRAWL',
    DIRECT_GAME = 'DIRECT_GAME',
    TRADITIONAL_HISTORIC = 'TRADITIONAL_HISTORIC',
    HISTORIC_BRAWL = 'HISTORIC_BRAWL',
    LIMITED = 'LIMITED',
}

export type GetBoardForDeckInput = {
    deckID: Scalars['String']
}

export type GetUserDataInput = {
    userID: Scalars['String']
}

export type ImageUri = {
    __typename?: 'ImageUri'
    border_crop: Scalars['String']
    png: Scalars['String']
    normal: Scalars['String']
}

export type ImageUriInput = {
    border_crop: Scalars['String']
    png: Scalars['String']
    normal: Scalars['String']
}

export type ImportedCard = {
    name: Scalars['String']
    set: Scalars['String']
    number: Scalars['String']
    numOfCards: Scalars['Int']
}

export type Loadstate = {
    __typename?: 'Loadstate'
    loading: Scalars['Boolean']
    errors: Array<Scalars['String']>
}

export type Mutation = {
    __typename?: 'Mutation'
    changeUserData: Scalars['Boolean']
    createDeck: DeckBoard
    deleteDeck: Scalars['Boolean']
    duplicateDeck: Deck
    saveDeck: Scalars['Boolean']
    saveDeckBoard: Deck
}

export type MutationChangeUserDataArgs = {
    input: ChangeUserDataInput
}

export type MutationCreateDeckArgs = {
    input: CreateDeckInput
}

export type MutationDeleteDeckArgs = {
    input: DeleteDeckInput
}

export type MutationDuplicateDeckArgs = {
    input: DuplicateDeckInput
}

export type MutationSaveDeckArgs = {
    input: SaveDeckInput
}

export type MutationSaveDeckBoardArgs = {
    input: SaveDeckBoardInput
}

export type Query = {
    __typename?: 'Query'
    getUserData: UserData
    getBoardForDeck: DeckBoard
}

export type QueryGetUserDataArgs = {
    input: GetUserDataInput
}

export type QueryGetBoardForDeckArgs = {
    input: GetBoardForDeckInput
}

export type SaveDeckBoardInput = {
    deckID: Scalars['String']
    columns: Array<BoardColumnInput>
}

export type SaveDeckInput = {
    ID: Scalars['String']
    name: Scalars['String']
    image?: Maybe<Scalars['String']>
    format: Format
}

export enum Settings {
    STACK_MODE = 'STACK_MODE',
    DELETE_CARDS_ON_DELETE_COLUMN = 'DELETE_CARDS_ON_DELETE_COLUMN',
    CONFIRM_ON_DELETE_CARD = 'CONFIRM_ON_DELETE_CARD',
    CONFIRM_ON_DELETE_COLUMN = 'CONFIRM_ON_DELETE_COLUMN',
}

export type UserData = {
    __typename?: 'UserData'
    ID: Scalars['String']
    username: Scalars['String']
    avatar?: Maybe<Scalars['String']>
    decks: Array<Maybe<Deck>>
    settings: Scalars['SettingsMap']
}
