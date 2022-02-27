import { GeneralState } from 'store/GeneralState/GeneralState.reducer'
import { MODAL_ACTION, DECK_EDITOR_MODALS, DeckBoard, SETTINGS } from 'utils/types'

export enum GeneralStateAction {
    DEFAULT = 'DEFAULT', // This is only for testing purposes
    SET_MODAL_STATE = 'SET_MODAL_STATE',
    SET_GENERAL_STATE = 'SET_GENERAL_STATE',
    SET_DECK_BOARD = 'SET_DECK_BOARD',
    SET_SETTINGS = 'SET_SETTINGS',
    ADD_CARD = 'ADD_CARD',
    REMOVE_CARD = 'REMOVE_CARD',
    EDIT_COLUMN = 'EDIT_COLUMN',
    DELETE_COLUMN = 'DELETE_COLUMN',
    SET_BOTTOM_BAR_STATE = 'SET_BOTTOM_BAR_STATE',
}

type GeneralStateActions =
    | { type: GeneralStateAction.DEFAULT }
    | { type: GeneralStateAction.SET_GENERAL_STATE; payload: Partial<GeneralState> }
    | {
          type: GeneralStateAction.SET_MODAL_STATE
          payload: { action: MODAL_ACTION; target: DECK_EDITOR_MODALS; message?: string }
      }
    | {
          type: GeneralStateAction.SET_DECK_BOARD
          payload: DeckBoard
      }
    | {
          type: GeneralStateAction.ADD_CARD
          payload: { cardIndex: number; columnIndex: number }
      }
    | {
          type: GeneralStateAction.REMOVE_CARD
          payload: { cardIndex: number; columnIndex: number }
      }
    | {
          type: GeneralStateAction.SET_SETTINGS
          payload: { setting: SETTINGS; value: boolean }
      }
    | {
          type: GeneralStateAction.EDIT_COLUMN
          payload: { columnIndex: number; newName: string }
      }
    | {
          type: GeneralStateAction.DELETE_COLUMN
          payload: number
      }
    | {
          type: GeneralStateAction.SET_BOTTOM_BAR_STATE
          payload: boolean
      }

export default GeneralStateActions
