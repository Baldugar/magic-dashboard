import { CardType, Color, MTGACard, Rarity } from 'graphql/types'
import { sortBy } from 'lodash'
import { Dispatch, SetStateAction } from 'react'
import { CatalogueFilterType } from 'store/CatalogueState/CatalogueState.reducer'
import { MTG_TYPE_DIVIDER } from 'utils/constants'
import { isNegativeTB, isNotUnsetTB, isPositiveTB, TernaryBoolean } from 'utils/ternaryBoolean'

export const getCardImages = (card: MTGACard): string[] => {
    const images: string[] = []

    if (card.imageUris) {
        images.push(card.imageUris.normal)
    } else {
        if (card.cardFaces) {
            card.cardFaces.forEach((face) => {
                if (face.imageUris) {
                    images.push(face.imageUris.normal)
                }
            })
        }
    }

    return images
}

export const getCardTypeFromString = (cardType: string): CardType => {
    return cardType.toUpperCase() as CardType
}

export const getCardTypeAndSubtypes = (card: MTGACard): { types: CardType[]; subtypes: string[] } => {
    const typeLine = card.typeLine.split(MTG_TYPE_DIVIDER).map((t) => t.trim())
    const types = typeLine[0].split(' ')
    const cardTypes = types.map(getCardTypeFromString)
    const subTypes = typeLine.length > 1 ? typeLine[1].split(' ') : []
    return { types: cardTypes, subtypes: subTypes }
}

export const filterCardType = (cards: MTGACard[], cardType: CardType): MTGACard[] =>
    cards.filter((card) => {
        try {
            return card.typeLine.includes(cardType)
        } catch (reason) {
            console.log('CARD BROKE', card, reason)
        }
    })

export const calculateSubtypes = (cards: MTGACard[]): string[] =>
    [
        ...cards.reduce((subtypes, card) => {
            const typeLine = card.typeLine.split(MTG_TYPE_DIVIDER)
            const cardSubtypes = typeLine[1] ? typeLine[1].split(' ') : []
            for (const subtype of cardSubtypes) {
                if (
                    !subtypes.includes(subtype) &&
                    subtype.length > 0 &&
                    subtype !== '//' &&
                    subtype !== 'Legendary' &&
                    subtype !== 'Creature' &&
                    subtype !== 'Artifact' &&
                    subtype !== 'Enchantment' &&
                    subtype !== 'Instant' &&
                    subtype !== 'Land' &&
                    subtype !== 'Planeswalker' &&
                    subtype !== 'Sorcery'
                ) {
                    subtypes.push(subtype)
                }
            }
            return subtypes
        }, [] as string[]),
    ].sort((a, b) => a.localeCompare(b))

export const calculateExpansions = (cards: MTGACard[]): { set: string; setName: string; releasedAt: number }[] =>
    sortBy(
        cards.reduce((expansions, card) => {
            if (card.set && expansions.find((e) => e.set === card.set) === undefined) {
                expansions.push({ set: card.set, setName: card.setName, releasedAt: card.releasedAt.getTime() })
            }
            return expansions
        }, [] as { set: string; setName: string; releasedAt: number }[]),
        'releasedAt',
    )

export const filterCards = (cards: MTGACard[], filter: CatalogueFilterType): MTGACard[] => {
    let remainingCards = [...cards]

    // SEARCH
    // TODO: PARSER

    // COLOR
    const colorEntries = Object.entries(filter.color).filter(([, value]) => isNotUnsetTB(value)) as [
        Color,
        TernaryBoolean,
    ][]
    const multi = filter.multiColor
    if (colorEntries.length > 0) {
        // SOLO 1
        if (colorEntries.length === 1) {
            // POSITIVO
            if (isPositiveTB(colorEntries[0][1])) {
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.colorIdentity.includes(colorEntries[0][0]) &&
                        (isPositiveTB(multi)
                            ? card.colorIdentity.length > 1
                            : isNegativeTB(multi)
                            ? card.colorIdentity.length === 1
                            : true),
                )
            } else {
                // NEGATIVO
                remainingCards = remainingCards.filter(
                    (card) =>
                        !card.colorIdentity.includes(colorEntries[0][0]) &&
                        (isPositiveTB(multi)
                            ? card.colorIdentity.length > 1
                            : isNegativeTB(multi)
                            ? card.colorIdentity.length === 1
                            : true),
                )
            }
        } else {
            // TODOS POSITIVOS
            if (colorEntries.every(([, value]) => isPositiveTB(value))) {
                const colors = colorEntries.map(([color]) => color)
                if (isPositiveTB(multi)) {
                    remainingCards = remainingCards.filter(
                        (card) => colors.every((c) => card.colorIdentity.includes(c)) && card.colorIdentity.length > 1,
                    )
                } else if (isNegativeTB(multi)) {
                    remainingCards = remainingCards.filter(
                        (card) => colors.some((c) => card.colorIdentity.includes(c)) && card.colorIdentity.length === 1,
                    )
                } else {
                    remainingCards = remainingCards.filter((card) => colors.some((c) => card.colorIdentity.includes(c)))
                }
            }
            // TODOS NEGATIVOS
            else if (colorEntries.every(([, value]) => isNegativeTB(value))) {
                const colors = colorEntries.map(([color]) => color)
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.colorIdentity.every((c) => !colors.includes(c)) &&
                        (isPositiveTB(multi)
                            ? card.colorIdentity.length > 1
                            : isNegativeTB(multi)
                            ? card.colorIdentity.length === 1
                            : true),
                )
            }
            // MIXTO
            else {
                const positiveColors = colorEntries.filter(([, color]) => isPositiveTB(color))
                const negativeColors = colorEntries.filter(([, color]) => isNegativeTB(color))
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.colorIdentity.some((c) => positiveColors.map(([color]) => color).includes(c)) &&
                        card.colorIdentity.every((c) => !negativeColors.map(([color]) => color).includes(c)) &&
                        (isPositiveTB(multi)
                            ? card.colorIdentity.length > 1
                            : isNegativeTB(multi)
                            ? card.colorIdentity.length === 1
                            : true),
                )
            }
        }
    } else {
        if (isPositiveTB(multi)) {
            remainingCards = remainingCards.filter((card) => card.colorIdentity.length > 1)
        } else if (isNegativeTB(multi)) {
            remainingCards = remainingCards.filter((card) => card.colorIdentity.length === 1)
        }
    }

    // RARITY
    const rarityEntries = Object.entries(filter.rarity).filter(([, value]) => isNotUnsetTB(value)) as [
        Rarity,
        TernaryBoolean,
    ][]
    if (rarityEntries.length > 0) {
        if (rarityEntries.length === 1) {
            if (isPositiveTB(rarityEntries[0][1])) {
                remainingCards = remainingCards.filter((card) => card.rarity === rarityEntries[0][0])
            } else {
                remainingCards = remainingCards.filter((card) => card.rarity !== rarityEntries[0][0])
            }
        } else {
            const positiveRarities = rarityEntries.filter(([, value]) => isPositiveTB(value))
            const negativeRarities = rarityEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveRarities.length === rarityEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveRarities.some(([rarity]) => rarity === card.rarity),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeRarities.length === rarityEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeRarities.every(([rarity]) => rarity !== card.rarity),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveRarities.some(([rarity]) => rarity === card.rarity) &&
                        negativeRarities.every(([rarity]) => rarity !== card.rarity),
                )
            }
        }
    }

    // MANA COST

    // SET

    // TYPE

    // SUBTYPE

    return remainingCards
}

export const fetchCards = (
    query: string,
    setMtgaCards: Dispatch<SetStateAction<any[]>>,
    setDone: Dispatch<SetStateAction<boolean>>,
): void => {
    console.log('ASDASD')
    fetch(query)
        .then((response) => {
            console.log('RESPONSE', response)
            return response.json()
        })
        .then((data) => {
            console.log(data, setMtgaCards, setDone)
            // setMtgaCards((curr) => [...curr, ...(data.data as MTGACard[]).map((card) => ({ ...card, categories: [] }))])
            // if (data.has_more) {
            //     fetchCards(data.next_page, setMtgaCards, setDone)
            // } else {
            //     console.log('DONE')
            //     setDone(true)
            // }
        })
}

export const computeSubtypes = (mtgaCreatures: any[]): string[] =>
    mtgaCreatures.reduce((acc, curr) => {
        if (curr.type_line.includes('Creature')) {
            const subtypes = curr.type_line.split(' — ')[1]
            if (subtypes) {
                const subtypeArray = subtypes.split(' ')
                for (const subtype of subtypeArray) {
                    if (!acc.includes(subtype) && subtype !== '//') {
                        acc.push(subtype)
                    }
                }
            } else {
                console.log(curr.name, curr.type_line)
            }
        }
        return acc
    }, [])
