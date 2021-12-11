export interface ImportedCard {
    name: string
    set: string
    number: string
    numOfCards: number
}

export interface ApiCard {
    name: string
    card_faces?: ApiCard[]
    image_uris?: {
        border_crop: string
        png: string
        normal: string
    }
    cmc: number
}

export interface Card extends ImportedCard, ApiCard {
    isCommander?: true
    isCompanion?: true
}

export interface Deck {
    name: string
    commander?: Card
    companion?: Card
    deck: Card[]
}

export interface BoardColumn {
    name: string
    cards: Card[]
}

export interface DeckBoard {
    columns: BoardColumn[]
}

export enum MODAL_ACTION {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
}

export enum MODALS {
    LOADING = 'LOADING',
    IMPORT_DECK = 'IMPORT_DECK',
    NEW_COLUMN = 'NEW_COLUMN',
    EDIT_COLUMN = 'EDIT_COLUMN',
    DELETE_CARD_CONFIRMATION = 'DELETE_CARD_CONFIRMATION',
    DELETE_COLUMN_CONFIRMATION = 'DELETE_COLUMN_CONFIRMATION',
    CARD_DETAILS = 'CARD_DETAILS',
}

export enum SETTINGS {
    STACK_MODE = 'STACK_MODE',
    DELETE_CARDS_ON_DELETE_COLUMN = 'DELETE_CARDS_ON_DELETE_COLUMN',
    CONFIRM_ON_DELETE_CARD = 'CONFIRM_ON_DELETE_CARD',
    CONFIRM_ON_DELETE_COLUMN = 'CONFIRM_ON_DELETE_COLUMN',
}

export enum COLORS {
    WHITE = 'W',
    BLUE = 'U',
    GREEN = 'G',
    RED = 'R',
    BLACK = 'B',
    COLORLESS = 'C',
}

export enum RARITY {
    COMMON = 'C',
    UNCOMMON = 'U',
    RARE = 'R',
    MYTHIC = 'M',
}

export interface Wildcard<T extends RARITY> {
    rarity: T
    number: number
}
