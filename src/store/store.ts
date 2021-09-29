import { combineReducers, createStore } from 'redux'
import GeneralStateReducer from './GeneralState/GeneralState.reducer'

export const rootReducer = combineReducers({
    generalState: GeneralStateReducer,
})

const store = createStore(rootReducer)
export default store
export type AppState = ReturnType<typeof rootReducer>
