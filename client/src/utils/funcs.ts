import { format } from 'date-fns'
import { chunk, cloneDeep, flatten, sortBy } from 'lodash'
import { DropResult } from 'react-beautiful-dnd'
import { API_CALL_TYPE, sendAPIRequest } from 'utils/api'
import { ApiCard, Card, Deck, DeckBoard, ImportedCard, MODALS, MODAL_ACTION } from 'utils/types'

const cardToCardInDeck = (card: string): ImportedCard => {
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
    setModalState: (payload: { action: MODAL_ACTION; target: MODALS; message?: string }) => void,
): Promise<void> => {
    let submittedCardsArray = deckImportRef?.current?.value
        .trim()
        .split('\n')
        .filter((v) => v.length > 0)
    let companion: string | undefined = undefined
    let commander: string | undefined = undefined
    const deckToState: Deck = { deck: [], name: '' }
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
                    query: `${commanderCard.name} and e:${commanderCard.set}`,
                },
                'GET',
            ).then((response) => {
                const apiCard: ApiCard | undefined = response.data.find((c) => c.name.includes(commanderCard.name))
                if (apiCard) {
                    let image_uris:
                        | {
                              border_crop: string
                              png: string
                              normal: string
                          }
                        | undefined = undefined
                    let card_faces: ApiCard[] | undefined = undefined
                    if (apiCard.image_uris) {
                        image_uris = apiCard.image_uris
                    }
                    if (apiCard.card_faces) {
                        card_faces = apiCard.card_faces
                    }
                    deckToState.commander = { ...commanderCard, image_uris, card_faces, cmc: apiCard.cmc }
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
                    query: `${companionCard.name} and e:${companionCard.set}`,
                },
                'GET',
            ).then((response) => {
                const apiCard: ApiCard | undefined = response.data.find((c) => c.name.includes(companionCard.name))
                if (apiCard) {
                    let image_uris:
                        | {
                              border_crop: string
                              png: string
                              normal: string
                          }
                        | undefined = undefined
                    let card_faces: ApiCard[] | undefined = undefined
                    if (apiCard.image_uris) {
                        image_uris = apiCard.image_uris
                    }
                    if (apiCard.card_faces) {
                        card_faces = apiCard.card_faces
                    }
                    deckToState.companion = { ...companionCard, image_uris, card_faces, cmc: apiCard.cmc }
                }
            })
        }

        // Rest of the deck
        submittedCardsArray.shift() // Remove "Deck" word

        if (submittedCardsArray.length > 0) {
            try {
                const deckCards = submittedCardsArray.map(cardToCardInDeck)
                const sortedDeck = sortBy(deckCards, 'name.length')
                const chunkedDeckCards = chunk(sortedDeck, 20)
                let count = chunkedDeckCards.length
                const done = () => {
                    count--
                    if (count === 0) {
                        setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.LOADING })
                        setDeck(deckToState)
                    }
                }
                for (let i = 0; i < chunkedDeckCards.length; i++) {
                    const currentChunk = cloneDeep(chunkedDeckCards[i])
                    setTimeout(async () => {
                        await sendAPIRequest<{ data: ApiCard[] }>(
                            {
                                type: API_CALL_TYPE.CARDS,
                                query: encodeURI(
                                    currentChunk
                                        .map(
                                            (c) =>
                                                `(${c.name} ${
                                                    c.set !== '' ? `and e:${c.set === 'ANA' ? 'OANA' : c.set}` : ''
                                                })`,
                                        )
                                        .join(' or '),
                                ),
                            },
                            'GET',
                        )
                            .then((response) => {
                                for (let i = 0; i < currentChunk.length; i++) {
                                    const cardToLookFor = currentChunk[i]
                                    const apiCard = response.data.find((card) => card.name.includes(cardToLookFor.name))
                                    if (apiCard) {
                                        let image_uris:
                                            | {
                                                  border_crop: string
                                                  png: string
                                                  normal: string
                                              }
                                            | undefined = undefined
                                        let card_faces: ApiCard[] | undefined = undefined
                                        if (apiCard.image_uris) {
                                            image_uris = apiCard.image_uris
                                        } else {
                                            console.log(apiCard)
                                        }
                                        if (apiCard.card_faces) {
                                            card_faces = apiCard.card_faces
                                        }
                                        deckToState.deck.push({
                                            ...cardToLookFor,
                                            image_uris,
                                            card_faces,
                                            cmc: apiCard.cmc,
                                        })
                                    }
                                }
                                done()
                            })
                            .catch((reason) => {
                                setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.LOADING })
                                alert(`Imported deck format is not correct, please check it and try again. ${reason}`)
                            })
                    }, 100 * i)
                }
            } catch (reason) {
                setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.LOADING })
                alert(`Imported deck format is not correct, please check it and try again. ${reason}`)
            }
        } else {
            setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.LOADING })
            alert('Imported deck format is not correct, please check it and try again.')
        }
    }
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

    for (let i = 0; i < deck.deck.length; i++) {
        deckToReturn.columns[deck.deck[i].cmc].cards.push(deck.deck[i])
    }

    if (deck.companion) {
        deckToReturn.columns.unshift({ name: 'Companion', cards: [{ ...deck.companion, isCompanion: true }] })
    }

    if (deck.commander) {
        deckToReturn.columns.unshift({ name: 'Commander', cards: [{ ...deck.commander, isCommander: true }] })
    }

    for (let i = 0; i < deckToReturn.columns.length; i++) {
        deckToReturn.columns[i].cards = sortBy(deckToReturn.columns[i].cards, 'name')
    }

    return deckToReturn
}

export const getDeckBoardEntries = (deckBoard: DeckBoard): [string, Card[]][] => Object.entries(deckBoard)

export const onDragEnd = (
    result: DropResult,
    deckBoard: DeckBoard,
    setDeckBoard: (deckBoard: DeckBoard) => void,
    setDraggedCard: (draggedCard: string) => void,
): void => {
    const { source, destination, type, reason } = result
    if (reason !== 'CANCEL' && destination !== undefined && destination !== null) {
        const currentBoard = cloneDeep(deckBoard)
        if (type === 'column') {
            if (source.index !== destination.index) {
                const sourceColumn = { ...currentBoard.columns[source.index] }
                currentBoard.columns.splice(source.index, 1)
                currentBoard.columns.splice(destination.index, 0, sourceColumn)
            }
        } else {
            if (source.droppableId === destination.droppableId) {
                if (source.index !== destination.index) {
                    const sourceColumn = currentBoard.columns.find((c) => `droppable-${c.name}` === source.droppableId)
                    if (sourceColumn) {
                        const sourceColumnIndex = currentBoard.columns.indexOf(sourceColumn)
                        const sourceCard = { ...sourceColumn.cards[source.index] }
                        sourceColumn.cards.splice(source.index, 1)
                        sourceColumn.cards.splice(destination.index, 0, sourceCard)
                        currentBoard.columns[sourceColumnIndex] = { ...sourceColumn }
                    }
                }
            } else {
                const sourceColumn = currentBoard.columns.find((c) => `droppable-${c.name}` === source.droppableId)
                const destinationColumn = currentBoard.columns.find(
                    (c) => `droppable-${c.name}` === destination.droppableId,
                )
                if (sourceColumn && destinationColumn) {
                    const sourceColumnIndex = currentBoard.columns.indexOf(sourceColumn)
                    const destinationColumnIndex = currentBoard.columns.indexOf(destinationColumn)
                    const sourceCard = { ...sourceColumn.cards[source.index] }
                    sourceColumn.cards.splice(source.index, 1)
                    destinationColumn.cards.splice(destination.index, 0, sourceCard)
                    currentBoard.columns[sourceColumnIndex] = sourceColumn
                    currentBoard.columns[destinationColumnIndex] = destinationColumn
                }
            }
        }
        setDeckBoard({ ...currentBoard })
    }
    setDraggedCard('')
}

export const convertCardToDeckExportString = (card: Card): string => {
    return `${card.numOfCards} ${card.name} (${card.set}) ${card.number}\n`
}

export const generateExportDeck = (deckBoard: DeckBoard): string => {
    let stringToReturn = ``
    const allCards = flatten(deckBoard.columns.map((c) => c.cards))

    const commanderCards = allCards.filter((c) => c.isCommander)
    if (commanderCards.length > 0) {
        stringToReturn = stringToReturn.concat(`Commander\n`)
        for (let i = 0; i < commanderCards.length; i++) {
            stringToReturn = stringToReturn.concat(convertCardToDeckExportString(commanderCards[i]))
        }
        stringToReturn = stringToReturn.concat('\n')
    }

    const companionCard = allCards.find((c) => c.isCompanion)
    if (companionCard) {
        stringToReturn = stringToReturn.concat(`Companion\n`)
        stringToReturn = stringToReturn.concat(convertCardToDeckExportString(companionCard))
        stringToReturn = stringToReturn.concat('\n')
    }

    const restOfDeck = allCards.filter((c) => !c.isCommander && !c.isCompanion)
    if (restOfDeck.length > 0) {
        stringToReturn = stringToReturn.concat(`Deck\n`)
    }
    for (let i = 0; i < restOfDeck.length; i++) {
        stringToReturn = stringToReturn.concat(convertCardToDeckExportString(restOfDeck[i]))
    }

    return stringToReturn
}

export const downloadExportedDeck = (deckString: string): void => {
    const element = document.createElement('a')
    const file = new Blob([deckString], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${format(new Date(), 'dd-MM-yyyy')}-deck.txt`
    document.body.appendChild(element)
    element.click()
    if (element.parentElement) {
        element.parentElement.removeChild(element)
    }
}
