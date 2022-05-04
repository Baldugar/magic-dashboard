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

export enum SortEnum {
    NAME = 'name',
    CMC = 'cmc',
    RARITY = 'rarity',
    COLOR = 'color',
    TYPE = 'type',
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export interface CatalogueState {
    // modals: Record<DECK_EDITOR_MODALS, boolean>
    filter: CatalogueFilterType
    sort: {
        sortBy: SortEnum
        sortDirection: SortDirection
    }
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
            common: 0,
            uncommon: 0,
            rare: 0,
            mythic: 0,
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
            artifact: 0,
            creature: 0,
            enchantment: 0,
            instant: 0,
            land: 0,
            planeswalker: 0,
            sorcery: 0,
        },
        subtype: {
            artifact: {},
            creature: {},
            enchantment: {},
            instant: {},
            land: {},
            planeswalker: {},
            sorcery: {},
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
    sort: {
        sortBy: SortEnum.NAME,
        sortDirection: SortDirection.ASC,
    },
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
        case CatalogueStateAction.SET_SORT:
            return {
                ...currentState,
                sort: { ...currentState.sort, ...action.payload },
            }
        default:
            return currentState
    }
}

export default CatalogueStateReducer
