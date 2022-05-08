import { GeneralState } from 'store/GeneralState/GeneralState.reducer'

export enum GeneralStateAction {
    DEFAULT = 'DEFAULT', // This is only for testing purposes
    SET_GENERAL_STATE = 'SET_GENERAL_STATE',
    SET_BOTTOM_BAR_STATE = 'SET_BOTTOM_BAR_STATE',
}

type GeneralStateActions =
    | { type: GeneralStateAction.DEFAULT }
    | { type: GeneralStateAction.SET_GENERAL_STATE; payload: Partial<GeneralState> }
    | {
          type: GeneralStateAction.SET_BOTTOM_BAR_STATE
          payload: boolean
      }

export default GeneralStateActions
