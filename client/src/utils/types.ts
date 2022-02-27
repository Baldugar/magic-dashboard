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

export enum DECK_EDITOR_MODALS {
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
    BLACK = 'B',
    BLUE = 'U',
    RED = 'R',
    GREEN = 'G',
    WHITE = 'W',
    COLORLESS = 'C',
}

export enum CARD_TYPES {
    // COMMANDERS = 'COMMANDERS',
    ARTIFACT = 'ARTIFACT',
    CREATURE = 'CREATURE',
    ENCHANTMENT = 'ENCHANTMENT',
    INSTANT = 'INSTANT',
    LAND = 'LAND',
    PLANESWALKER = 'PLANESWALKER',
    SORCERY = 'SORCERY',
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

export interface MTGACard {
    all_parts?: AllPart[]
    arena_id?: number
    artist_ids?: string[]
    artist: string
    booster: boolean
    border_color: string
    card_back_id?: string
    card_faces?: CardFace[]
    cardmarket_id?: number
    categories: string[] // IDS of categories
    cmc: number
    collector_number: string
    color_identity: string[]
    color_indicator?: string[]
    colors?: string[]
    digital: boolean
    edhrec_rank?: number
    finishes: string[]
    flavor_name?: string
    flavor_text?: string
    foil: boolean
    frame_effects?: string[]
    frame: string
    full_art: boolean
    games: string[]
    highres_image: boolean
    id: string
    illustration_id?: string
    image_status: string
    image_uris?: ImageUris
    keywords: string[]
    lang: string
    layout: string
    legalities: Legalities
    loyalty?: string
    mana_cost?: string
    mtgo_foil_id?: number
    mtgo_id?: number
    multiverse_ids: number[]
    name: string
    nonfoil: boolean
    object: string
    oracle_id: string
    oracle_text?: string
    oversized: boolean
    power?: string
    preview?: Preview
    prices: Prices
    printed_name?: string
    prints_search_uri: string
    produced_mana?: string[]
    promo_types?: string[]
    promo: boolean
    purchase_uris: PurchaseUris
    rarity: string
    related_uris: RelatedUris
    released_at: string
    reprint: boolean
    reserved: boolean
    rulings_uri: string
    scryfall_set_uri: string
    scryfall_uri: string
    security_stamp?: string
    set_id: string
    set_name: string
    set_search_uri: string
    set_type: string
    set_uri: string
    set: string
    story_spotlight: boolean
    tcgplayer_etched_id?: number
    tcgplayer_id?: number
    textless: boolean
    toughness?: string
    type_line: string
    uri: string
    variation: boolean
    watermark?: string
}

export interface ImageUris {
    small: string
    normal: string
    large: string
    png: string
    art_crop: string
    border_crop: string
}

export interface Legalities {
    standard: string
    future: string
    historic: string
    gladiator: string
    pioneer: string
    modern: string
    legacy: string
    pauper: string
    vintage: string
    penny: string
    commander: string
    brawl: string
    historicbrawl: string
    alchemy: string
    paupercommander: string
    duel: string
    oldschool: string
    premodern: string
}

export interface Prices {
    usd?: string
    usd_foil?: string
    usd_etched?: string
    eur?: string
    eur_foil?: string
    tix?: string
}

export interface RelatedUris {
    gatherer?: string
    tcgplayer_infinite_articles: string
    tcgplayer_infinite_decks: string
    edhrec: string
    mtgtop8: string
}

export interface PurchaseUris {
    tcgplayer: string
    cardmarket: string
    cardhoarder: string
}

export interface Preview {
    source: string
    source_uri: string
    previewed_at: string
}

export interface CardFace {
    object: string
    name: string
    mana_cost: string
    type_line: string
    oracle_text: string
    watermark?: string
    artist?: string
    artist_id?: string
    illustration_id?: string
    colors?: string[]
    power?: string
    toughness?: string
    image_uris?: ImageUris
    flavor_text?: string
    loyalty?: string
    flavor_name?: string
    color_indicator?: string[]
}
export interface AllPart {
    object: string
    id: string
    component: string
    name: string
    type_line: string
    uri: string
}

export enum CARD_IMAGE_SIZE {
    SMALL = 'small',
    NORMAL = 'normal',
    LARGE = 'large',
    ART_CROP = 'art_crop',
    BORDER_CROP = 'border_crop',
}

export interface CardCategory {
    id: string // uuid
    name: string
    colors: COLORS[]
}
