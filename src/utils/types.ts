export interface ImportedCard {
    name: string
    set: string
    number: string
}

export interface ImportedCardInDeck extends ImportedCard {
    numOfCards: number
}

export interface ApiCard {
    name: string
    card_faces?: ApiCard[]
    image_uris?: {
        border_crop: string
    }
    cmc: number
}

export interface Card extends ImportedCardInDeck {
    imageUrl: string
    cmc: number
}
export interface Deck {
    commander?: Card
    companion?: Card
    deck: Card[]
}
