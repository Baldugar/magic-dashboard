import { cloneDeep } from 'lodash'
import GeneralStateActions, { GeneralStateAction } from 'store/GeneralState/GeneralState.actions'

export interface GeneralState {
    bottomBarOpened: boolean
}

export const initialGeneralState: GeneralState = {
    bottomBarOpened: true,
}

function GeneralStateReducer(state: GeneralState = initialGeneralState, action: GeneralStateActions): GeneralState {
    const currentState = cloneDeep(state)
    switch (action.type) {
        case GeneralStateAction.SET_GENERAL_STATE:
            return {
                ...currentState,
                ...action.payload,
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
