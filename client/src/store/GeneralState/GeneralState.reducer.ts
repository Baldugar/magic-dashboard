import { cloneDeep, isEqual } from 'lodash'
import GeneralStateActions, { GeneralStateAction } from 'store/GeneralState/GeneralState.actions'
import { Card, DeckBoard, DECK_EDITOR_MODALS, MODAL_ACTION, SETTINGS } from 'utils/types'

export interface GeneralState {
    // modals: { [key in keyof typeof MODALS]: boolean }
    modals: Record<DECK_EDITOR_MODALS, boolean>
    loadingMessage: string
    settings: Record<SETTINGS, boolean>
    deckBoard: DeckBoard
    cardToDelete: { cardIndex: number; columnIndex: number } | undefined
    columnToEdit: { columnIndex: number; name: string } | undefined
    selectedCard: Card | undefined
    bottomBarOpened: boolean
}

export const initialGeneralState: GeneralState = {
    modals: {
        IMPORT_DECK: false,
        LOADING: false,
        NEW_COLUMN: false,
        EDIT_COLUMN: false,
        DELETE_CARD_CONFIRMATION: false,
        DELETE_COLUMN_CONFIRMATION: false,
        CARD_DETAILS: false,
    },
    settings: {
        STACK_MODE: false,
        DELETE_CARDS_ON_DELETE_COLUMN: false,
        CONFIRM_ON_DELETE_CARD: true,
        CONFIRM_ON_DELETE_COLUMN: true,
    },
    deckBoard: {
        columns: [],
    },
    loadingMessage: '',
    cardToDelete: undefined,
    columnToEdit: undefined,
    selectedCard: undefined,
    bottomBarOpened: true,
}

function GeneralStateReducer(state: GeneralState = initialGeneralState, action: GeneralStateActions): GeneralState {
    const currentState = cloneDeep(state)
    switch (action.type) {
        case GeneralStateAction.SET_MODAL_STATE:
            const currentModals = cloneDeep(currentState.modals)
            currentModals[action.payload.target] = action.payload.action === MODAL_ACTION.CLOSE ? false : true
            if (action.payload.target === DECK_EDITOR_MODALS.LOADING && action.payload.message !== undefined) {
                if (action.payload.action === MODAL_ACTION.OPEN) {
                    currentState.loadingMessage = action.payload.message
                } else {
                    currentState.loadingMessage = ''
                }
            }
            if (
                action.payload.target === DECK_EDITOR_MODALS.DELETE_CARD_CONFIRMATION &&
                action.payload.action === MODAL_ACTION.CLOSE
            ) {
                currentState.cardToDelete = undefined
            }
            if (
                action.payload.target === DECK_EDITOR_MODALS.DELETE_COLUMN_CONFIRMATION &&
                action.payload.action === MODAL_ACTION.CLOSE
            ) {
                currentState.columnToEdit = undefined
            }
            return {
                ...currentState,
                modals: currentModals,
            }
        case GeneralStateAction.SET_SETTINGS:
            const currentSettings = cloneDeep(currentState.settings)
            currentSettings[action.payload.setting] = action.payload.value
            return {
                ...currentState,
                settings: currentSettings,
            }
        case GeneralStateAction.SET_GENERAL_STATE:
            return {
                ...currentState,
                ...action.payload,
            }
        case GeneralStateAction.SET_DECK_BOARD:
            return {
                ...currentState,
                deckBoard: action.payload,
            }
        case GeneralStateAction.ADD_CARD: {
            const cardToModify =
                currentState.deckBoard.columns[action.payload.columnIndex].cards[action.payload.cardIndex]
            cardToModify.numOfCards++
            return {
                ...currentState,
            }
        }
        case GeneralStateAction.REMOVE_CARD: {
            const cardToModify =
                currentState.deckBoard.columns[action.payload.columnIndex].cards[action.payload.cardIndex]
            if (cardToModify.numOfCards === 1) {
                if (
                    isEqual(currentState.cardToDelete, action.payload) ||
                    currentState.settings.CONFIRM_ON_DELETE_CARD === false
                ) {
                    currentState.deckBoard.columns[action.payload.columnIndex].cards.splice(action.payload.cardIndex, 1)
                } else {
                    return {
                        ...currentState,
                        modals: {
                            ...currentState.modals,
                            DELETE_CARD_CONFIRMATION: true,
                        },
                        cardToDelete: action.payload,
                    }
                }
            } else {
                cardToModify.numOfCards--
            }
            return {
                ...currentState,
                cardToDelete: undefined,
            }
        }
        case GeneralStateAction.EDIT_COLUMN:
            currentState.deckBoard.columns[action.payload.columnIndex].name = action.payload.newName
            return {
                ...currentState,
                columnToEdit: undefined,
            }
        case GeneralStateAction.DELETE_COLUMN:
            if (currentState.deckBoard.columns[action.payload].name !== 'Unsorted') {
                if (!currentState.settings.DELETE_CARDS_ON_DELETE_COLUMN) {
                    const cardsToMove = currentState.deckBoard.columns[action.payload].cards
                    const unsortedColumnIndex = currentState.deckBoard.columns.findIndex((c) => c.name === 'Unsorted')
                    if (unsortedColumnIndex !== -1) {
                        currentState.deckBoard.columns[unsortedColumnIndex].cards.push(...cardsToMove)
                    } else {
                        currentState.deckBoard.columns.push({ name: 'Unsorted', cards: cardsToMove })
                    }
                }

                currentState.deckBoard.columns.splice(action.payload, 1)
            }
            return {
                ...currentState,
                columnToEdit: undefined,
                modals: {
                    ...currentState.modals,
                    DELETE_COLUMN_CONFIRMATION: false,
                    EDIT_COLUMN: false,
                },
            }
        case GeneralStateAction.SET_BOTTOM_BAR_STATE:
            return {
                ...state,
                bottomBarOpened: action.payload,
            }
        default:
            return state
    }
}

export default GeneralStateReducer
