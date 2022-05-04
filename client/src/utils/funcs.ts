import { CardType, Color, ImageUris, Layout, MTGACard, MTGACard_User, Rarity, Set } from 'graphql/types'
import { orderBy } from 'lodash'
import { Dispatch, SetStateAction } from 'react'
import { CatalogueFilterType, CMCFilter, SortDirection, SortEnum } from 'store/CatalogueState/CatalogueState.reducer'
import { MTG_TYPE_DIVIDER } from 'utils/constants'
import { isNegativeTB, isNotUnsetTB, isPositiveTB, TernaryBoolean } from 'utils/ternaryBoolean'

export const getCardImages = (card: MTGACard): string[] => {
    const images: string[] = []

    if (card.image_uris) {
        images.push(card.image_uris.normal)
    } else {
        if (card.card_faces) {
            card.card_faces.forEach((face) => {
                if (face.image_uris) {
                    images.push(face.image_uris.normal)
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
    const typeLine = card.type_line.split(MTG_TYPE_DIVIDER).map((t) => t.trim())
    const types = typeLine[0].split(' ')
    const cardTypes = types.map(getCardTypeFromString)
    const subTypes = typeLine.length > 1 ? typeLine[1].split(' ') : []
    return { types: cardTypes, subtypes: subTypes }
}

export const filterCardType = (cards: MTGACard[], cardType: CardType): MTGACard[] =>
    cards.filter((card) => {
        try {
            return card.type_line.includes(cardType)
        } catch (reason) {
            console.log('CARD BROKE', card, reason)
        }
    })

export const calculateSubtypes = (cards: MTGACard[]): string[] =>
    [
        ...cards.reduce((subtypes, card) => {
            const typeLine = card.type_line.split(MTG_TYPE_DIVIDER)
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
    orderBy(
        cards.reduce((expansions, card) => {
            if (card.set && expansions.find((e) => e.set === card.set) === undefined) {
                expansions.push({
                    set: card.set,
                    setName: card.set_name,
                    releasedAt: new Date(card.released_at).getTime(),
                })
            }
            return expansions
        }, [] as { set: string; setName: string; releasedAt: number }[]),
        'releasedAt',
    )

const convertToRarity = (rarity: string): Rarity | string => {
    switch (rarity) {
        case 'common':
        case 'c':
            return Rarity.common
        case 'uncommon':
        case 'u':
            return Rarity.uncommon
        case 'rare':
        case 'r':
            return Rarity.rare
        case 'mythic':
        case 'm':
            return Rarity.mythic
        default:
            return 'common'
    }
}

export const calculateQuery = (
    s: string,
):
    | {
          q: string
          t: 'CardType' | 'Rarity' | 'search'
          not: boolean
      }
    | { q: number; t: 'CMC'; not: boolean } => {
    if (s.includes('t:')) {
        const q = s.split('t:')[1].trim()
        return {
            q: q.startsWith('!') ? q.substring(1) : q,
            t: 'CardType',
            not: q.startsWith('!'),
        }
    }
    if (s.includes('r:')) {
        const q = s.split('r:')[1].trim()
        return {
            q: convertToRarity(q.startsWith('!') ? q.substring(1) : q),
            t: 'Rarity',
            not: q.startsWith('!'),
        }
    }
    if (s.includes('cmc:')) {
        const q = s.split('cmc:')[1].trim()
        return {
            q: Number(q.startsWith('!') ? q.substring(1) : q),
            t: 'CMC',
            not: q.startsWith('!'),
        }
    }
    const q = s.trim()
    return {
        q: q.startsWith('!') ? q.substring(1) : q,
        t: 'search',
        not: q.startsWith('!'),
    }
}

export const filterCards = (
    cards: MTGACard[],
    filter: CatalogueFilterType,
    sortBy: SortEnum,
    sortDirection: SortDirection,
): MTGACard[] => {
    let remainingCards = [...cards]

    // SEARCH
    if (filter.searchString.length > 0) {
        const strings = filter.searchString.split(';')
        const searchQueries = strings.map(calculateQuery)
        remainingCards = remainingCards.filter((card) => {
            for (const query of searchQueries) {
                switch (query.t) {
                    case 'CardType':
                        {
                            const fails = !card.type_line.toLowerCase().includes(query.q.toLowerCase())
                            if ((query.not && !fails) || (!query.not && fails)) {
                                return false
                            }
                        }
                        break
                    case 'Rarity':
                        {
                            const fails = card.rarity !== query.q
                            if ((query.not && !fails) || (!query.not && fails)) {
                                return false
                            }
                        }
                        break
                    case 'CMC':
                        {
                            const fails = card.cmc !== query.q
                            if ((query.not && !fails) || (!query.not && fails)) {
                                return false
                            }
                        }
                        break
                    case 'search': {
                        const fails = !(
                            card.name.toLowerCase().includes(query.q.toLowerCase()) ||
                            card.type_line.toLowerCase().includes(query.q.toLowerCase()) ||
                            card.set_name.toLowerCase().includes(query.q.toLowerCase()) ||
                            card.set.toLowerCase().includes(query.q.toLowerCase()) ||
                            (card.oracle_text && card.oracle_text.toLowerCase().includes(query.q.toLowerCase())) ||
                            (card.flavor_text && card.flavor_text.toLowerCase().includes(query.q.toLowerCase()))
                        )
                        if ((query.not && !fails) || (!query.not && fails)) {
                            return false
                        }
                    }
                }
            }
            return true
        })
    }
    console.log('Search filter', remainingCards.length)

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
                        card.color_identity.includes(colorEntries[0][0]) &&
                        (isPositiveTB(multi)
                            ? card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.color_identity.length === 1
                            : true),
                )
            } else {
                // NEGATIVO
                remainingCards = remainingCards.filter(
                    (card) =>
                        !card.color_identity.includes(colorEntries[0][0]) &&
                        (isPositiveTB(multi)
                            ? card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.color_identity.length === 1
                            : true),
                )
            }
        } else {
            // TODOS POSITIVOS
            if (colorEntries.every(([, value]) => isPositiveTB(value))) {
                const colors = colorEntries.map(([color]) => color)
                if (isPositiveTB(multi)) {
                    remainingCards = remainingCards.filter(
                        (card) =>
                            colors.every((c) => card.color_identity.includes(c)) && card.color_identity.length > 1,
                    )
                } else if (isNegativeTB(multi)) {
                    remainingCards = remainingCards.filter(
                        (card) =>
                            colors.some((c) => card.color_identity.includes(c)) && card.color_identity.length === 1,
                    )
                } else {
                    remainingCards = remainingCards.filter((card) =>
                        colors.some((c) => card.color_identity.includes(c)),
                    )
                }
            }
            // TODOS NEGATIVOS
            else if (colorEntries.every(([, value]) => isNegativeTB(value))) {
                const colors = colorEntries.map(([color]) => color)
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.color_identity.every((c) => !colors.includes(c)) &&
                        (isPositiveTB(multi)
                            ? card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.color_identity.length === 1
                            : true),
                )
            }
            // MIXTO
            else {
                const positiveColors = colorEntries.filter(([, color]) => isPositiveTB(color))
                const negativeColors = colorEntries.filter(([, color]) => isNegativeTB(color))
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.color_identity.some((c) => positiveColors.map(([color]) => color).includes(c)) &&
                        card.color_identity.every((c) => !negativeColors.map(([color]) => color).includes(c)) &&
                        (isPositiveTB(multi)
                            ? card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.color_identity.length === 1
                            : true),
                )
            }
        }
    } else {
        if (isPositiveTB(multi)) {
            remainingCards = remainingCards.filter((card) => card.color_identity.length > 1)
        } else if (isNegativeTB(multi)) {
            remainingCards = remainingCards.filter((card) => card.color_identity.length === 1)
        }
    }
    console.log('After Color', remainingCards.length)

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
    console.log('After Rarity', remainingCards.length)

    // MANA COST
    const manaCostEntries = Object.entries(filter.manaCosts).filter(([, value]) => isNotUnsetTB(value)) as [
        CMCFilter,
        TernaryBoolean,
    ][]
    if (manaCostEntries.length > 0) {
        if (manaCostEntries.length === 1) {
            const isInfinite = manaCostEntries[0][0] === 'infinite'
            if (isPositiveTB(manaCostEntries[0][1])) {
                remainingCards = remainingCards.filter((card) => {
                    return isInfinite ? card.cmc > 9 : card.cmc === Number(manaCostEntries[0][0])
                })
            } else {
                remainingCards = remainingCards.filter((card) =>
                    isInfinite ? card.cmc <= 9 : card.cmc !== Number(manaCostEntries[0][0]),
                )
            }
        } else {
            const positiveManaCosts = manaCostEntries.filter(([, value]) => isPositiveTB(value))
            const negativeManaCosts = manaCostEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveManaCosts.length === manaCostEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveManaCosts.some(([manaCost]) => {
                        const isInfinite = manaCost === 'infinite'
                        return isInfinite ? card.cmc > 9 : Number(manaCost) === card.cmc
                    }),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeManaCosts.length === manaCostEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeManaCosts.every(([manaCost]) => {
                        const isInfinite = manaCost === 'infinite'
                        return isInfinite ? card.cmc <= 9 : Number(manaCost) !== card.cmc
                    }),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveManaCosts.some(([manaCost]) => {
                            const isInfinite = manaCost === 'infinite'
                            return isInfinite ? card.cmc > 9 : Number(manaCost) === card.cmc
                        }) &&
                        negativeManaCosts.every(([manaCost]) => {
                            const isInfinite = manaCost === 'infinite'
                            return isInfinite ? card.cmc <= 9 : Number(manaCost) !== card.cmc
                        }),
                )
            }
        }
    }
    console.log('After CMC', remainingCards.length)

    // EXPANSIONS
    const expansionEntries = Object.entries(filter.expansions).filter(([, value]) => isNotUnsetTB(value)) as [
        Set,
        TernaryBoolean,
    ][]
    if (expansionEntries.length > 0) {
        if (expansionEntries.length === 1) {
            if (isPositiveTB(expansionEntries[0][1])) {
                remainingCards = remainingCards.filter((card) => card.set === expansionEntries[0][0])
            } else {
                remainingCards = remainingCards.filter((card) => card.set !== expansionEntries[0][0])
            }
        } else {
            const positiveExpansions = expansionEntries.filter(([, value]) => isPositiveTB(value))
            const negativeExpansions = expansionEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveExpansions.length === expansionEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveExpansions.some(([expansion]) => expansion === card.set),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeExpansions.length === expansionEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeExpansions.every(([expansion]) => expansion !== card.set),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveExpansions.some(([expansion]) => expansion === card.set) &&
                        negativeExpansions.every(([expansion]) => expansion !== card.set),
                )
            }
        }
    }
    console.log('After Expansion', remainingCards.length)

    // TYPE
    const typeEntries = Object.entries(filter.cardTypes).filter(([, value]) => isNotUnsetTB(value)) as [
        CardType,
        TernaryBoolean,
    ][]
    if (typeEntries.length > 0) {
        if (typeEntries.length === 1) {
            if (isPositiveTB(typeEntries[0][1])) {
                remainingCards = remainingCards.filter((card) =>
                    card.type_line.toLowerCase().includes(typeEntries[0][0]),
                )
            } else {
                remainingCards = remainingCards.filter(
                    (card) => !card.type_line.toLowerCase().includes(typeEntries[0][0]),
                )
            }
        } else {
            const positiveTypes = typeEntries.filter(([, value]) => isPositiveTB(value))
            const negativeTypes = typeEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveTypes.length === typeEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveTypes.every(([type]) => card.type_line.toLowerCase().includes(type)),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeTypes.length === typeEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeTypes.every(([type]) => !card.type_line.toLowerCase().includes(type)),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveTypes.every(([type]) => card.type_line.toLowerCase().includes(type)) &&
                        negativeTypes.every(([type]) => !card.type_line.toLowerCase().includes(type)),
                )
            }
        }
    }
    console.log('After Type', remainingCards.length)

    // SUBTYPE

    const isDescending = sortDirection === SortDirection.DESC
    switch (sortBy) {
        case SortEnum.NAME:
        case SortEnum.CMC:
            remainingCards = orderBy(remainingCards, [sortBy], [isDescending ? 'desc' : 'asc'])
            break
        case SortEnum.COLOR:
            const colorToValue = (c: Color): number => {
                switch (c) {
                    case Color.C:
                        return isDescending ? 5 : 0
                    case Color.W:
                        return isDescending ? 4 : 1
                    case Color.U:
                        return isDescending ? 3 : 2
                    case Color.R:
                        return isDescending ? 2 : 3
                    case Color.B:
                        return isDescending ? 1 : 4
                    case Color.G:
                        return isDescending ? 0 : 5
                }
            }
            remainingCards = orderBy(
                remainingCards,
                [
                    'color_identity.length',
                    (c: MTGACard) => {
                        const addedValue = c.color_identity.reduce((acc, color) => {
                            return acc + colorToValue(color)
                        }, 0)
                        return addedValue
                    },
                ],
                [isDescending ? 'desc' : 'asc'],
            )
            break
        case SortEnum.RARITY:
            const rarityToValue = (r: Rarity): number => {
                switch (r) {
                    case Rarity.common:
                        return 0
                    case Rarity.uncommon:
                        return 1
                    case Rarity.rare:
                        return 2
                    case Rarity.mythic:
                        return 3
                }
            }
            remainingCards = orderBy(
                remainingCards,
                [
                    (c) => {
                        return rarityToValue(c.rarity)
                    },
                ],
                [isDescending ? 'desc' : 'asc'],
            )
            break
        case SortEnum.TYPE:
            const typeToValue = (t: CardType): number => {
                switch (t) {
                    case CardType.artifact:
                        return 0
                    case CardType.creature:
                        return 1
                    case CardType.enchantment:
                        return 2
                    case CardType.instant:
                        return 3
                    case CardType.land:
                        return 4
                    case CardType.planeswalker:
                        return 5
                    case CardType.sorcery:
                        return 6
                }
            }
            remainingCards = orderBy(
                remainingCards,
                [
                    (c) => {
                        const types: Record<CardType, boolean> = {
                            artifact: false,
                            creature: false,
                            enchantment: false,
                            instant: false,
                            land: false,
                            planeswalker: false,
                            sorcery: false,
                        }
                        for (const cardType of Object.keys(CardType)) {
                            if (c.type_line.toLowerCase().includes(cardType)) {
                                types[cardType as CardType] = true
                            }
                        }

                        return Object.entries(types).reduce((acc, [cardType, isIncluded]) => {
                            if (isIncluded) {
                                return acc + typeToValue(cardType as CardType)
                            } else {
                                return acc
                            }
                        }, 0)
                    },
                ],
                [isDescending ? 'desc' : 'asc'],
            )
    }

    return remainingCards
}

export const fetchCards = (
    query: string,
    setMtgaCards: Dispatch<SetStateAction<MTGACard_User[]>>,
    setDone: Dispatch<SetStateAction<boolean>>,
): void => {
    fetch(query)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            const convertToMTGACard = (card: any): MTGACard_User => ({
                card: {
                    id: card.id,
                    name: card.name,
                    cmc: card.cmc,
                    color_identity: card.color_identity.length === 0 ? [Color.C] : (card.color_identity as Color[]),
                    layout: card.layout as Layout,
                    mana_cost: card.mana_cost,
                    type_line: card.type_line,
                    oracle_text: card.oracle_text,
                    power: card.power,
                    toughness: card.toughness,
                    loyalty: card.loyalty,
                    legalities: {
                        alchemy: card.legalities.alchemy,
                        brawl: card.legalities.brawl,
                        historic: card.legalities.historic,
                        historicbrawl: card.legalities.historicbrawl,
                        standard: card.legalities.standard,
                    },
                    rarity: card.rarity,
                    released_at: card.released_at,
                    set_name: card.set_name,
                    rulings_uri: card.rulings_uri,
                    set_uri: card.set_uri,
                    set: card.set as Set,
                    scryfall_uri: card.scryfall_uri,
                    card_faces: card.card_faces
                        ? card.card_faces.map((c: any) => ({
                              color_indicator: c.color_indicator,
                              colors: c.colors,
                              flavor_text: c.flavor_text,
                              image_uris: c.image_uris
                                  ? ({
                                        art_crop: c.image_uris.art_crop,
                                        border_crop: c.image_uris.border_crop,
                                        large: c.image_uris.large,
                                        normal: c.image_uris.normal,
                                        png: c.image_uris.png,
                                        small: c.image_uris.small,
                                    } as ImageUris)
                                  : undefined,
                              loyalty: c.loyalty,
                              mana_cost: c.mana_cost,
                              name: c.name,
                              oracle_text: c.oracle_text,
                              power: c.power,
                              toughness: c.toughness,
                              type_line: c.type_line,
                          }))
                        : undefined,
                    colors: card.colors,
                    flavor_text: card.flavor_text,
                    produced_mana: card.produced_mana,
                    image_uris: card.image_uris
                        ? {
                              art_crop: card.image_uris.art_crop,
                              border_crop: card.image_uris.border_crop,
                              large: card.image_uris.large,
                              normal: card.image_uris.normal,
                              png: card.image_uris.png,
                              small: card.image_uris.small,
                          }
                        : undefined,
                },
                userCardTags: [],
                userDeckTags: [],
                userRating: 0,
            })
            setMtgaCards((curr) => [...curr, ...data.data.map(convertToMTGACard)])
            if (data.has_more) {
                fetchCards(data.next_page, setMtgaCards, setDone)
            } else {
                console.log('DONE')
                setDone(true)
            }
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
