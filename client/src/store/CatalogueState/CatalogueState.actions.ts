import { CatalogueFilterType } from 'store/CatalogueState/CatalogueState.reducer'

export enum CatalogueStateAction {
    DEFAULT = 'DEFAULT', // This is only for testing purposes
    SET_FILTER = 'SET_FILTER',
    SET_ZOOM_LEVEL = 'SET_ZOOM_LEVEL',
}

type CatalogueStateActions =
    | { type: CatalogueStateAction.DEFAULT }
    | { type: CatalogueStateAction.SET_FILTER; payload: Partial<CatalogueFilterType> }
    | { type: CatalogueStateAction.SET_ZOOM_LEVEL; payload: 'IN' | 'OUT' }

export default CatalogueStateActions
