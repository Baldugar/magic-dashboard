import { combineReducers, createStore } from 'redux'
import CatalogueStateReducer from 'store/CatalogueState/CatalogueState.reducer'
import GeneralStateReducer from './GeneralState/GeneralState.reducer'

export const rootReducer = combineReducers({
    generalState: GeneralStateReducer,
    catalogueState: CatalogueStateReducer,
})

const store = createStore(rootReducer)
export default store
export type AppState = ReturnType<typeof rootReducer>
