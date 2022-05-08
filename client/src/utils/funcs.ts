import { CardType, Color, MTGACard, MTGACard_User, Rarity, Set, UserTag } from 'graphql/types'
import { isEqual, maxBy, orderBy } from 'lodash'
import {
    CatalogueFilterType,
    CMCFilter,
    initialCatalogueState,
    SortDirection,
    SortEnum,
} from 'store/CatalogueState/CatalogueState.reducer'
import colors from 'utils/colors'
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
    cards: MTGACard_User[],
    filter: CatalogueFilterType,
    sortBy: SortEnum,
    sortDirection: SortDirection,
): MTGACard_User[] => {
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
                            const fails = !card.card.type_line.toLowerCase().includes(query.q.toLowerCase())
                            if ((query.not && !fails) || (!query.not && fails)) {
                                return false
                            }
                        }
                        break
                    case 'Rarity':
                        {
                            const fails = card.card.rarity !== query.q
                            if ((query.not && !fails) || (!query.not && fails)) {
                                return false
                            }
                        }
                        break
                    case 'CMC':
                        {
                            const fails = card.card.cmc !== query.q
                            if ((query.not && !fails) || (!query.not && fails)) {
                                return false
                            }
                        }
                        break
                    case 'search': {
                        const cardNameChecks = card.card.name.toLowerCase().includes(query.q.toLowerCase())
                        const cardTypeLineChecks = card.card.type_line.toLowerCase().includes(query.q.toLowerCase())
                        const cardSetNameChecks = card.card.set_name.toLowerCase().includes(query.q.toLowerCase())
                        const cardSetChecks = card.card.set.toLowerCase().includes(query.q.toLowerCase())
                        const cardOracleTextChecks = card.card.oracle_text
                            ? card.card.oracle_text.toLowerCase().includes(query.q.toLowerCase())
                            : false
                        const cardFlavorTextChecks = card.card.flavor_text
                            ? card.card.flavor_text.toLowerCase().includes(query.q.toLowerCase())
                            : false
                        let checks =
                            cardNameChecks ||
                            cardTypeLineChecks ||
                            cardSetNameChecks ||
                            cardSetChecks ||
                            cardOracleTextChecks ||
                            cardFlavorTextChecks
                        if (card.card.card_faces) {
                            for (const cardFace of card.card.card_faces) {
                                const cardFaceNameChecks = cardFace.name.toLowerCase().includes(query.q.toLowerCase())
                                const cardFaceTypeLineChecks = cardFace.type_line
                                    ? cardFace.type_line.toLowerCase().includes(query.q.toLowerCase())
                                    : false
                                const cardFaceOracleTextChecks = cardFace.oracle_text
                                    ? cardFace.oracle_text.toLowerCase().includes(query.q.toLowerCase())
                                    : false
                                const cardFaceFlavorTextChecks = cardFace.flavor_text
                                    ? cardFace.flavor_text.toLowerCase().includes(query.q.toLowerCase())
                                    : false
                                checks =
                                    checks ||
                                    cardFaceNameChecks ||
                                    cardFaceTypeLineChecks ||
                                    cardFaceOracleTextChecks ||
                                    cardFaceFlavorTextChecks
                            }
                        }

                        if ((query.not && checks) || (!query.not && !checks)) {
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
                        card.card.color_identity.includes(colorEntries[0][0]) &&
                        (isPositiveTB(multi)
                            ? card.card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.card.color_identity.length === 1
                            : true),
                )
            } else {
                // NEGATIVO
                remainingCards = remainingCards.filter(
                    (card) =>
                        !card.card.color_identity.includes(colorEntries[0][0]) &&
                        (isPositiveTB(multi)
                            ? card.card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.card.color_identity.length === 1
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
                            colors.every((c) => card.card.color_identity.includes(c)) &&
                            card.card.color_identity.length > 1,
                    )
                } else if (isNegativeTB(multi)) {
                    remainingCards = remainingCards.filter(
                        (card) =>
                            colors.some((c) => card.card.color_identity.includes(c)) &&
                            card.card.color_identity.length === 1,
                    )
                } else {
                    remainingCards = remainingCards.filter((card) =>
                        colors.some((c) => card.card.color_identity.includes(c)),
                    )
                }
            }
            // TODOS NEGATIVOS
            else if (colorEntries.every(([, value]) => isNegativeTB(value))) {
                const colors = colorEntries.map(([color]) => color)
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.card.color_identity.every((c) => !colors.includes(c)) &&
                        (isPositiveTB(multi)
                            ? card.card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.card.color_identity.length === 1
                            : true),
                )
            }
            // MIXTO
            else {
                const positiveColors = colorEntries.filter(([, color]) => isPositiveTB(color))
                const negativeColors = colorEntries.filter(([, color]) => isNegativeTB(color))
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.card.color_identity.some((c) => positiveColors.map(([color]) => color).includes(c)) &&
                        card.card.color_identity.every((c) => !negativeColors.map(([color]) => color).includes(c)) &&
                        (isPositiveTB(multi)
                            ? card.card.color_identity.length > 1
                            : isNegativeTB(multi)
                            ? card.card.color_identity.length === 1
                            : true),
                )
            }
        }
    } else {
        if (isPositiveTB(multi)) {
            remainingCards = remainingCards.filter((card) => card.card.color_identity.length > 1)
        } else if (isNegativeTB(multi)) {
            remainingCards = remainingCards.filter((card) => card.card.color_identity.length === 1)
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
                remainingCards = remainingCards.filter((card) => card.card.rarity === rarityEntries[0][0])
            } else {
                remainingCards = remainingCards.filter((card) => card.card.rarity !== rarityEntries[0][0])
            }
        } else {
            const positiveRarities = rarityEntries.filter(([, value]) => isPositiveTB(value))
            const negativeRarities = rarityEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveRarities.length === rarityEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveRarities.some(([rarity]) => rarity === card.card.rarity),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeRarities.length === rarityEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeRarities.every(([rarity]) => rarity !== card.card.rarity),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveRarities.some(([rarity]) => rarity === card.card.rarity) &&
                        negativeRarities.every(([rarity]) => rarity !== card.card.rarity),
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
                    return isInfinite ? card.card.cmc > 9 : card.card.cmc === Number(manaCostEntries[0][0])
                })
            } else {
                remainingCards = remainingCards.filter((card) =>
                    isInfinite ? card.card.cmc <= 9 : card.card.cmc !== Number(manaCostEntries[0][0]),
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
                        return isInfinite ? card.card.cmc > 9 : Number(manaCost) === card.card.cmc
                    }),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeManaCosts.length === manaCostEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeManaCosts.every(([manaCost]) => {
                        const isInfinite = manaCost === 'infinite'
                        return isInfinite ? card.card.cmc <= 9 : Number(manaCost) !== card.card.cmc
                    }),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveManaCosts.some(([manaCost]) => {
                            const isInfinite = manaCost === 'infinite'
                            return isInfinite ? card.card.cmc > 9 : Number(manaCost) === card.card.cmc
                        }) &&
                        negativeManaCosts.every(([manaCost]) => {
                            const isInfinite = manaCost === 'infinite'
                            return isInfinite ? card.card.cmc <= 9 : Number(manaCost) !== card.card.cmc
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
                remainingCards = remainingCards.filter((card) => card.card.set === expansionEntries[0][0])
            } else {
                remainingCards = remainingCards.filter((card) => card.card.set !== expansionEntries[0][0])
            }
        } else {
            const positiveExpansions = expansionEntries.filter(([, value]) => isPositiveTB(value))
            const negativeExpansions = expansionEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveExpansions.length === expansionEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveExpansions.some(([expansion]) => expansion === card.card.set),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeExpansions.length === expansionEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeExpansions.every(([expansion]) => expansion !== card.card.set),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveExpansions.some(([expansion]) => expansion === card.card.set) &&
                        negativeExpansions.every(([expansion]) => expansion !== card.card.set),
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
                    card.card.type_line.toLowerCase().includes(typeEntries[0][0]),
                )
            } else {
                remainingCards = remainingCards.filter(
                    (card) => !card.card.type_line.toLowerCase().includes(typeEntries[0][0]),
                )
            }
        } else {
            const positiveTypes = typeEntries.filter(([, value]) => isPositiveTB(value))
            const negativeTypes = typeEntries.filter(([, value]) => isNegativeTB(value))
            // TODOS POSITIVOS
            if (positiveTypes.length === typeEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    positiveTypes.every(([type]) => card.card.type_line.toLowerCase().includes(type)),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeTypes.length === typeEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeTypes.every(([type]) => !card.card.type_line.toLowerCase().includes(type)),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveTypes.every(([type]) => card.card.type_line.toLowerCase().includes(type)) &&
                        negativeTypes.every(([type]) => !card.card.type_line.toLowerCase().includes(type)),
                )
            }
        }
    }
    console.log('After Type', remainingCards.length)

    const rating = filter.rating
    const shouldCheckRating = !isEqual(rating, initialCatalogueState.filter.rating)
    const shouldCheckMinRating = rating.min !== null
    const shouldCheckMaxRating = rating.max !== null
    // CATEGORIES
    if (isNegativeTB(filter.cardsWithoutCategory)) {
        remainingCards = remainingCards.filter((card) => card.userCardTags.length > 0 || card.userDeckTags.length > 0)
    }
    const categoryEntries = Object.entries(filter.categories).filter(([, value]) => isNotUnsetTB(value)) as [
        string,
        TernaryBoolean,
    ][]
    if (categoryEntries.length > 0) {
        if (categoryEntries.length === 1) {
            const checkForSingle = (tag: UserTag): boolean => {
                let checks = tag.tag.id === categoryEntries[0][0]
                if (shouldCheckRating) {
                    if (rating.min !== null) {
                        checks = checks && tag.rating >= rating.min
                    }
                    if (rating.max !== null) {
                        checks = checks && tag.rating <= rating.max
                    }
                }
                return checks
            }
            if (isPositiveTB(categoryEntries[0][1])) {
                remainingCards = remainingCards.filter(
                    (card) =>
                        card.userCardTags.find(checkForSingle) ||
                        card.userDeckTags.find(checkForSingle) ||
                        (isPositiveTB(filter.cardsWithoutCategory) &&
                            card.userCardTags.length === 0 &&
                            card.userDeckTags.length === 0),
                )
            } else {
                remainingCards = remainingCards.filter(
                    (card) => !card.userCardTags.find(checkForSingle) && !card.userDeckTags.find(checkForSingle),
                )
            }
        } else {
            const positiveCategories = categoryEntries.filter(([, value]) => isPositiveTB(value))
            const negativeCategories = categoryEntries.filter(([, value]) => isNegativeTB(value))
            const checkForCategory = (tag: UserTag, category: string): boolean => {
                let checks = tag.tag.id === category
                if (shouldCheckRating) {
                    if (rating.min !== null) {
                        checks = checks && tag.rating >= rating.min
                    }
                    if (rating.max !== null) {
                        checks = checks && tag.rating <= rating.max
                    }
                }
                return checks
            }
            // TODOS POSITIVOS
            if (positiveCategories.length === categoryEntries.length) {
                remainingCards = remainingCards.filter(
                    (card) =>
                        positiveCategories.some(
                            ([category]) =>
                                card.userCardTags.find((tag) => checkForCategory(tag, category)) ||
                                card.userDeckTags.find((tag) => checkForCategory(tag, category)),
                        ) ||
                        (isPositiveTB(filter.cardsWithoutCategory) &&
                            card.userCardTags.length === 0 &&
                            card.userDeckTags.length === 0),
                )
            }
            // TODOS NEGATIVOS
            else if (negativeCategories.length === categoryEntries.length) {
                remainingCards = remainingCards.filter((card) =>
                    negativeCategories.every(
                        ([category]) =>
                            !card.userCardTags.find((tag) => checkForCategory(tag, category)) &&
                            !card.userDeckTags.find((tag) => checkForCategory(tag, category)),
                    ),
                )
            }
            // MIXTO
            else {
                remainingCards = remainingCards.filter(
                    (card) =>
                        (positiveCategories.some(
                            ([category]) =>
                                card.userCardTags.find((tag) => checkForCategory(tag, category)) ||
                                card.userDeckTags.find((tag) => checkForCategory(tag, category)),
                        ) &&
                            negativeCategories.every(
                                ([category]) =>
                                    !card.userCardTags.find((tag) => checkForCategory(tag, category)) &&
                                    !card.userDeckTags.find((tag) => checkForCategory(tag, category)),
                            )) ||
                        (isPositiveTB(filter.cardsWithoutCategory) &&
                            card.userCardTags.length === 0 &&
                            card.userDeckTags.length === 0),
                )
            }
        }
    } else {
        // RATING WITHOUT CATEGORIES
        if (!isEqual(filter.rating, initialCatalogueState.filter.rating)) {
            if (shouldCheckMinRating && shouldCheckMaxRating) {
                remainingCards = remainingCards.filter(
                    (card) => rating.min && rating.max && card.rating >= rating.min && card.rating <= rating.max,
                )
            } else if (shouldCheckMinRating) {
                remainingCards = remainingCards.filter((card) => rating.min && card.rating >= rating.min)
            } else if (shouldCheckMaxRating) {
                remainingCards = remainingCards.filter((card) => rating.max && card.rating <= rating.max)
            }
        }
        console.log('After Rating', remainingCards.length)
    }
    console.log('After Category', remainingCards.length)

    const isDescending = sortDirection === SortDirection.DESC
    switch (sortBy) {
        case SortEnum.NAME:
        case SortEnum.CMC:
            remainingCards = orderBy(remainingCards, [`card.${sortBy}`], [isDescending ? 'desc' : 'asc'])
            break
        case SortEnum.COLOR:
            const colorToValue = (c: Color): string => {
                switch (c) {
                    case Color.C:
                        return 'A'
                    case Color.W:
                        return 'B'
                    case Color.U:
                        return 'C'
                    case Color.R:
                        return 'D'
                    case Color.B:
                        return 'E'
                    case Color.G:
                        return 'F'
                }
            }
            remainingCards = orderBy(
                remainingCards,
                [
                    'card.color_identity.length',
                    (c: MTGACard_User) => {
                        const addedValue = c.card.color_identity.reduce((acc, color) => {
                            return acc + colorToValue(color)
                        }, '')
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
                        return rarityToValue(c.card.rarity)
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
                            if (c.card.type_line.toLowerCase().includes(cardType)) {
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
            break
        case SortEnum.RATING:
            remainingCards = orderBy(
                remainingCards,
                [
                    (card) => {
                        const checkForSingle = (tag: UserTag): boolean => {
                            let checks = tag.tag.id === categoryEntries[0][0]
                            if (shouldCheckRating) {
                                if (rating.min !== null) {
                                    checks = checks && tag.rating >= rating.min
                                }
                                if (rating.max !== null) {
                                    checks = checks && tag.rating <= rating.max
                                }
                            }
                            return checks
                        }
                        const categoryEntries = Object.entries(filter.categories).filter(([, value]) =>
                            isNotUnsetTB(value),
                        ) as [string, TernaryBoolean][]
                        if (categoryEntries.length === 0) {
                            return card.rating
                        } else {
                            if (categoryEntries.length === 1) {
                                if (isPositiveTB(categoryEntries[0][1])) {
                                    if (isPositiveTB(filter.cardsWithoutCategory)) {
                                        const userCardTag = card.userCardTags.find(checkForSingle)
                                        const userDeckTag = card.userDeckTags.find(checkForSingle)
                                        if (userCardTag) {
                                            return userCardTag.rating
                                        }
                                        if (userDeckTag) {
                                            return userDeckTag.rating
                                        }
                                        return card.rating
                                    } else {
                                        const userCardTag = card.userCardTags.find(checkForSingle)
                                        const userDeckTag = card.userDeckTags.find(checkForSingle)
                                        if (userCardTag) {
                                            return userCardTag.rating
                                        }
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        return userDeckTag!.rating
                                    }
                                } else {
                                    return card.rating
                                }
                            } else {
                                const positiveCategories = categoryEntries.filter(([, value]) => isPositiveTB(value))
                                const negativeCategories = categoryEntries.filter(([, value]) => isNegativeTB(value))
                                const checkForCategory = (tag: UserTag, category: string): boolean => {
                                    let checks = tag.tag.id === category
                                    if (shouldCheckRating) {
                                        if (rating.min !== null) {
                                            checks = checks && tag.rating >= rating.min
                                        }
                                        if (rating.max !== null) {
                                            checks = checks && tag.rating <= rating.max
                                        }
                                    }
                                    return checks
                                }
                                if (negativeCategories.length === categoryEntries.length) {
                                    return card.rating
                                } else {
                                    const userCardTags =
                                        positiveCategories.length === categoryEntries.length
                                            ? card.userCardTags.filter((tag) =>
                                                  positiveCategories.some(([category]) =>
                                                      checkForCategory(tag, category),
                                                  ),
                                              )
                                            : card.userCardTags.filter((c) => {
                                                  return (
                                                      positiveCategories.some(([category]) =>
                                                          checkForCategory(c, category),
                                                      ) &&
                                                      negativeCategories.every(
                                                          ([category]) => !checkForCategory(c, category),
                                                      )
                                                  )
                                              })
                                    const userDeckTags =
                                        positiveCategories.length === categoryEntries.length
                                            ? card.userDeckTags.filter((tag) =>
                                                  positiveCategories.some(([category]) =>
                                                      checkForCategory(tag, category),
                                                  ),
                                              )
                                            : card.userDeckTags.filter((c) => {
                                                  return (
                                                      positiveCategories.some(([category]) =>
                                                          checkForCategory(c, category),
                                                      ) &&
                                                      negativeCategories.every(
                                                          ([category]) => !checkForCategory(c, category),
                                                      )
                                                  )
                                              })
                                    let ratingToReturn = card.rating
                                    let userCardRating = 0
                                    let userDeckRating = 0
                                    if (userCardTags.length > 0) {
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        userCardRating = maxBy(userCardTags, (tag) => tag.rating)!.rating
                                    }
                                    if (userDeckTags.length > 0) {
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        userDeckRating = maxBy(userDeckTags, (tag) => tag.rating)!.rating
                                    }
                                    if (userCardRating !== 0 || userDeckRating !== 0) {
                                        ratingToReturn = Math.max(userCardRating, userDeckRating)
                                    }
                                    return ratingToReturn
                                }
                            }
                        }
                    },
                ],
                [isDescending ? 'desc' : 'asc'],
            )
    }

    return remainingCards
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

export const calculateColor = (
    c: Color[],
): { background?: string; gradient?: { left: string; right: string }; foreground: string } => {
    if (c.length === 1) {
        switch (c[0]) {
            case Color.B:
                return colors.cardPills.one_color.black
            case Color.W:
                return colors.cardPills.one_color.white
            case Color.R:
                return colors.cardPills.one_color.red
            case Color.G:
                return colors.cardPills.one_color.green
            case Color.U:
                return colors.cardPills.one_color.blue
            case Color.C:
                return colors.cardPills.one_color.colorless
        }
    }
    if (c.length === 2) {
        if (c.includes(Color.C)) {
            switch (c[c.findIndex((co) => co !== Color.C)]) {
                case Color.B:
                    return colors.cardPills.one_color.black
                case Color.W:
                    return colors.cardPills.one_color.white
                case Color.R:
                    return colors.cardPills.one_color.red
                case Color.G:
                    return colors.cardPills.one_color.green
                case Color.U:
                    return colors.cardPills.one_color.blue
                case Color.C:
                    return colors.cardPills.one_color.colorless
            }
        } else {
            const colorMap: Record<
                Color,
                Record<Color, { left?: string; right?: string; foreground?: string; background?: string }>
            > = {
                [Color.B]: {
                    [Color.U]: colors.cardPills.two_colors.dimir,
                    [Color.G]: colors.cardPills.two_colors.golgari,
                    [Color.R]: colors.cardPills.two_colors.rakdos,
                    [Color.W]: colors.cardPills.two_colors.orzhov,
                    [Color.C]: colors.cardPills.one_color.black,
                    [Color.B]: colors.cardPills.one_color.black,
                },
                [Color.U]: {
                    [Color.B]: colors.cardPills.two_colors.dimir,
                    [Color.G]: colors.cardPills.two_colors.simic,
                    [Color.R]: colors.cardPills.two_colors.izzet,
                    [Color.W]: colors.cardPills.two_colors.azorius,
                    [Color.C]: colors.cardPills.one_color.blue,
                    [Color.U]: colors.cardPills.one_color.blue,
                },
                [Color.G]: {
                    [Color.B]: colors.cardPills.two_colors.golgari,
                    [Color.U]: colors.cardPills.two_colors.simic,
                    [Color.R]: colors.cardPills.two_colors.gruul,
                    [Color.W]: colors.cardPills.two_colors.selesnya,
                    [Color.C]: colors.cardPills.one_color.green,
                    [Color.G]: colors.cardPills.one_color.green,
                },
                [Color.R]: {
                    [Color.B]: colors.cardPills.two_colors.rakdos,
                    [Color.U]: colors.cardPills.two_colors.izzet,
                    [Color.G]: colors.cardPills.two_colors.gruul,
                    [Color.W]: colors.cardPills.two_colors.boros,
                    [Color.C]: colors.cardPills.one_color.red,
                    [Color.R]: colors.cardPills.one_color.red,
                },
                [Color.W]: {
                    [Color.B]: colors.cardPills.two_colors.orzhov,
                    [Color.U]: colors.cardPills.two_colors.azorius,
                    [Color.G]: colors.cardPills.two_colors.selesnya,
                    [Color.R]: colors.cardPills.two_colors.boros,
                    [Color.C]: colors.cardPills.one_color.white,
                    [Color.W]: colors.cardPills.one_color.white,
                },
                [Color.C]: {
                    [Color.B]: colors.cardPills.one_color.black,
                    [Color.U]: colors.cardPills.one_color.blue,
                    [Color.G]: colors.cardPills.one_color.green,
                    [Color.R]: colors.cardPills.one_color.red,
                    [Color.W]: colors.cardPills.one_color.white,
                    [Color.C]: colors.cardPills.one_color.colorless,
                },
            }
            const color = colorMap[c[0]][c[1]]
            const toReturn: { background?: string; gradient?: { left: string; right: string }; foreground: string } = {
                foreground: colors.cardPills.two_colors.foreground,
            }
            if (color.background) {
                toReturn.background = color.background
            } else if (color.left && color.right) {
                toReturn.gradient = { left: color.left, right: color.right }
            }
            return { ...toReturn }
        }
    }
    return {
        background: colors.cardPills.multi_colors.background,
        foreground: colors.cardPills.multi_colors.foreground,
    }
}
