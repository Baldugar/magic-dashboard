import { chunk, sortBy } from 'lodash'
import { API_CALL_TYPE, sendAPIRequest } from 'utils/api'
import { ApiCard, Card, Deck, ImportedCardInDeck } from 'utils/types'

const cardToCardInDeck = (card: string): ImportedCardInDeck => {
    const splittedCard = card.trim().split(' ')
    const numOfCards = Number(splittedCard[0])
    const number = isNaN(Number(splittedCard[splittedCard.length - 1])) ? '0' : splittedCard[splittedCard.length - 1]
    const set = /\([a-zA-Z0-9]{3}\)/g.test(card)
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          card
              .match(/\([a-zA-Z0-9]{3}\)/g)![0]!
              .replace('(', '')
              .replace(')', '')
        : ''
    if (number !== '0') {
        splittedCard.pop()
    }
    if (set !== '') {
        splittedCard.pop()
    }
    splittedCard.shift()
    console.log({
        name: splittedCard.join(' ').replace('///', '//'),
        numOfCards,
        number,
        set,
    })
    return {
        name: splittedCard.join(' ').replace('///', '//'),
        numOfCards,
        number,
        set,
    }
}

export const submitDeck = async (
    deckImportRef: React.MutableRefObject<HTMLTextAreaElement | undefined>,
    setDeck: React.Dispatch<React.SetStateAction<Deck | undefined>>,
): Promise<void> => {
    let submittedCardsArray = deckImportRef?.current?.value
        .trim()
        .split('\n')
        .filter((v) => v.length > 0)
    let companion: string | undefined = undefined
    let commander: string | undefined = undefined
    const deckToState: Deck = { deck: [] }
    if (submittedCardsArray) {
        // Remove the sideboard
        const sideboardStartingIndex = submittedCardsArray.findIndex((c) => c === 'Sideboard')
        if (sideboardStartingIndex !== -1) {
            submittedCardsArray = submittedCardsArray.slice(0, sideboardStartingIndex)
        }

        // Look for commander
        const commanderIndex = submittedCardsArray.findIndex((c) => c === 'Commander')
        if (commanderIndex !== -1) {
            commander = submittedCardsArray[commanderIndex + 1]
            submittedCardsArray.splice(commanderIndex, 2)
            const commanderCard = cardToCardInDeck(commander)
            await sendAPIRequest<{ data: ApiCard[] }>(
                {
                    type: API_CALL_TYPE.CARDS,
                    name: `${commanderCard.name} and e:${commanderCard.set}`,
                },
                'GET',
            ).then((response) => {
                const apiCard: ApiCard | undefined = response.data.find((c) => c.name.includes(commanderCard.name))
                if (apiCard) {
                    let image = ''
                    if (apiCard.image_uris) {
                        image = apiCard.image_uris.border_crop
                    } else if (apiCard.card_faces && apiCard.card_faces[0].image_uris) {
                        image = apiCard.card_faces[0].image_uris.border_crop
                    }
                    deckToState.commander = { ...commanderCard, imageUrl: image, cmc: apiCard.cmc }
                }
            })
        }

        // Look for companion
        const companionIndex = submittedCardsArray.findIndex((c) => c === 'Companion')
        if (companionIndex !== -1) {
            companion = submittedCardsArray[companionIndex + 1]
            submittedCardsArray.splice(companionIndex, 2)
            const companionCard = cardToCardInDeck(companion)
            await sendAPIRequest<{ data: ApiCard[] }>(
                {
                    type: API_CALL_TYPE.CARDS,
                    name: `${companionCard.name} and e:${companionCard.set}`,
                },
                'GET',
            ).then((response) => {
                const apiCard: ApiCard | undefined = response.data.find((c) => c.name.includes(companionCard.name))
                if (apiCard) {
                    let image = ''
                    if (apiCard.image_uris) {
                        image = apiCard.image_uris.border_crop
                    } else if (apiCard.card_faces && apiCard.card_faces[0].image_uris) {
                        image = apiCard.card_faces[0].image_uris.border_crop
                    }
                    deckToState.companion = { ...companionCard, imageUrl: image, cmc: apiCard.cmc }
                }
            })
        }

        // Rest of the deck
        submittedCardsArray.shift()

        const deckCards = submittedCardsArray.map(cardToCardInDeck)
        const sortedDeck = sortBy(deckCards, 'name.length')
        const chunkedDeckCards = chunk(sortedDeck, 20)
        for (let i = 0; i < chunkedDeckCards.length; i++) {
            const currentChunk = chunkedDeckCards[i]
            await sendAPIRequest<{ data: ApiCard[] }>(
                {
                    type: API_CALL_TYPE.CARDS,
                    name: encodeURI(
                        currentChunk.map((c) => `(${c.name} ${c.set !== '' ? `and e:${c.set}` : ''})`).join(' or '),
                    ),
                },
                'GET',
            ).then((response) => {
                for (let i = 0; i < currentChunk.length; i++) {
                    const cardToLookFor = currentChunk[i]
                    const cardToPush = response.data.find((card) => card.name.includes(cardToLookFor.name))
                    if (cardToPush) {
                        let image = ''
                        if (cardToPush.image_uris) {
                            image = cardToPush.image_uris.border_crop
                        } else if (cardToPush.card_faces && cardToPush.card_faces[0].image_uris) {
                            image = cardToPush.card_faces[0].image_uris.border_crop
                        }
                        deckToState.deck.push({
                            ...cardToLookFor,
                            imageUrl: image,
                            cmc: cardToPush.cmc,
                        })
                    }
                }
            })
        }
    }
    setDeck(deckToState)
}

export interface BoardColumn {
    name: string | number
    cards: Card[]
}

export interface DeckBoard {
    columns: BoardColumn[]
}

// export type DeckBoard = { [key: string]: Card[] }

export const generateDeckBoard = (deck: Deck): DeckBoard => {
    const deckToReturn: DeckBoard = {
        columns: [],
    }
    let maxCost = -1
    if (deck.commander) {
        if (deck.commander.cmc > maxCost) {
            maxCost = deck.commander.cmc
        }
    }
    if (deck.companion) {
        if (deck.companion.cmc > maxCost) {
            maxCost = deck.companion.cmc
        }
    }

    for (let i = 0; i < deck.deck.length; i++) {
        const card = deck.deck[i]
        if (card.cmc > maxCost) {
            maxCost = card.cmc
        }
    }
    for (let i = 0; i <= maxCost; i++) {
        deckToReturn.columns[i] = {
            name: `CMC = ${i}`,
            cards: [],
        }
    }

    if (deck.commander) {
        deckToReturn.columns[deck.commander.cmc].cards.push(deck.commander)
    }

    if (deck.companion) {
        deckToReturn.columns[deck.companion.cmc].cards.push(deck.companion)
    }

    for (let i = 0; i < deck.deck.length; i++) {
        deckToReturn.columns[deck.deck[i].cmc].cards.push(deck.deck[i])
    }

    for (let i = 0; i <= maxCost; i++) {
        deckToReturn.columns[i].cards = sortBy(deckToReturn.columns[i].cards, 'name')
    }

    return deckToReturn
}

export const getDeckBoardEntries = (deckBoard: DeckBoard): [string, Card[]][] => Object.entries(deckBoard)
