import { Rarity, Color, CardType, Set } from 'graphql/types'
import { cloneDeep } from 'lodash'
import CatalogueStateActions, { CatalogueStateAction } from 'store/CatalogueState/CatalogueState.actions'
import { TernaryBoolean } from 'utils/ternaryBoolean'
export type CMCFilter = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'infinite'

export interface CatalogueFilterType {
    searchString: string
    rarity: Record<Rarity, TernaryBoolean>
    color: Record<Color, TernaryBoolean>
    manaCosts: Record<CMCFilter, TernaryBoolean>
    cardTypes: Record<CardType, TernaryBoolean>
    multiColor: TernaryBoolean
    subtype: Record<CardType, Record<string, TernaryBoolean>>
    categories: string[]
    expansions: Record<Set, TernaryBoolean>
}

export interface CatalogueState {
    // modals: Record<DECK_EDITOR_MODALS, boolean>
    filter: CatalogueFilterType
    zoom: 'IN' | 'OUT'
}

export const initialCatalogueState: CatalogueState = {
    filter: {
        color: {
            Black: 0,
            Blue: 0,
            Green: 0,
            Red: 0,
            White: 0,
            Colorless: 0,
        },
        rarity: {
            Common: 0,
            Uncommon: 0,
            Rare: 0,
            Mythic: 0,
        },
        searchString: '',
        multiColor: 0,
        manaCosts: {
            '0': 0,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            infinite: 0,
        },
        cardTypes: {
            ARTIFACT: 0,
            CREATURE: 0,
            ENCHANTMENT: 0,
            INSTANT: 0,
            LAND: 0,
            PLANESWALKER: 0,
            SORCERY: 0,
        },
        subtype: {
            ARTIFACT: {},
            CREATURE: {},
            ENCHANTMENT: {},
            INSTANT: {},
            LAND: {},
            PLANESWALKER: {},
            SORCERY: {},
        },
        categories: [],
        expansions: (() => {
            const expansions = {} as Partial<Record<Set, TernaryBoolean>>
            Object.keys(Set).forEach((set: string) => {
                expansions[set as Set] = 0
            })
            return expansions as Record<Set, TernaryBoolean>
        })(),
    },
    zoom: 'IN',
}

function CatalogueStateReducer(
    state: CatalogueState = initialCatalogueState,
    action: CatalogueStateActions,
): CatalogueState {
    const currentState = cloneDeep(state)
    switch (action.type) {
        case CatalogueStateAction.SET_FILTER:
            const currentFilter = cloneDeep(currentState.filter)
            return {
                ...currentState,
                filter: {
                    ...currentFilter,
                    ...action.payload,
                },
            }
        case CatalogueStateAction.SET_ZOOM_LEVEL:
            return {
                ...currentState,
                zoom: action.payload,
            }
        default:
            return currentState
    }
}

export default CatalogueStateReducer
