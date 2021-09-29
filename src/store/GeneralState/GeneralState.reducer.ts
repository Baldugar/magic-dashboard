import GeneralStateActions from 'store/GeneralState/GeneralState.actions'

export interface GeneralState {
    a: string
}

export const initialGeneralState: GeneralState = {
    a: '',
}

function GeneralStateReducer(state: GeneralState = initialGeneralState, action: GeneralStateActions): GeneralState {
    switch (action.type) {
        default:
            return state
    }
}

export default GeneralStateReducer
