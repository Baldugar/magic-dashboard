import { cloneDeep } from 'lodash'
import CatalogueStateActions, { CatalogueStateAction } from 'store/CatalogueState/CatalogueState.actions'
import { TernaryBoolean } from 'utils/ternaryBoolean'
import { CARD_TYPES, COLORS, RARITY } from 'utils/types'

export type CMCFilter = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'infinite'

export interface CatalogueFilterType {
    searchString: string
    rarity: { [key in RARITY]: TernaryBoolean }
    color: { [key in COLORS]: TernaryBoolean }
    manaCosts: { [key in CMCFilter]: TernaryBoolean }
    cardTypes: { [key in CARD_TYPES]: TernaryBoolean }
    multiColor: TernaryBoolean
    subtype: { [key in CARD_TYPES]: { [subkey: string]: TernaryBoolean } }
    categories: string[]
    expansions: { [key: string]: TernaryBoolean }
    andOr: 'and' | 'or'
}

export interface CatalogueState {
    // modals: Record<DECK_EDITOR_MODALS, boolean>
    filter: CatalogueFilterType
    zoom: 'IN' | 'OUT'
}

export const initialCatalogueState: CatalogueState = {
    filter: {
        color: {
            B: 0,
            C: 0,
            G: 0,
            R: 0,
            U: 0,
            W: 0,
        },
        rarity: {
            C: 0,
            M: 0,
            R: 0,
            U: 0,
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
            // COMMANDERS: false,
            CREATURE: 0,
            ENCHANTMENT: 0,
            INSTANT: 0,
            LAND: 0,
            PLANESWALKER: 0,
            SORCERY: 0,
        },
        subtype: {
            ARTIFACT: {},
            // COMMANDERS: {},
            CREATURE: {},
            ENCHANTMENT: {},
            INSTANT: {},
            LAND: {},
            PLANESWALKER: {},
            SORCERY: {},
        },
        categories: [],
        expansions: {},
        andOr: 'or',
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
