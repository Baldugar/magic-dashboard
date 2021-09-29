import { ActiveUser, Loadstate } from 'graphql/types'
import { GeneralStateAction } from './GeneralState.actions'
import GeneralStateReducer, { DrawerTab, GeneralState, initialGeneralState } from './GeneralState.reducer'

let initialGeneralStateForTest: GeneralState = initialGeneralState

describe('GeneralState Reducer', () => {
    beforeEach(() => {
        initialGeneralStateForTest = { ...initialGeneralState }
    })
    it('should trigger the default', () => {
        const stateReturned = GeneralStateReducer(undefined, {
            type: GeneralStateAction.DEFAULT,
        })
        expect(stateReturned).toStrictEqual(initialGeneralStateForTest)
    })
    it('should trigger ActiveUser', () => {
        const newUser: ActiveUser = {
            id: '111111111',
            email: 'test@User.de',
            roles: ['admin'],
        }
        const stateReturned = GeneralStateReducer(initialGeneralStateForTest, {
            type: GeneralStateAction.SET_ACTIVE_USER,
            payload: newUser,
        })
        expect(stateReturned).toStrictEqual({
            ...initialGeneralState,
            activeUser: newUser,
        })
    })
    it('should trigger loadstate', () => {
        const newLoadstate: Loadstate = { loading: true, errors: ['error1', 'error2'] }
        const stateReturned = GeneralStateReducer(initialGeneralStateForTest, {
            type: GeneralStateAction.SET_LOADSTATE,
            payload: newLoadstate,
        })
        expect(stateReturned).toStrictEqual({
            ...initialGeneralState,
            loadstate: newLoadstate,
        })
    })
    it('should set drawerOpen', () => {
        const stateReturned = GeneralStateReducer(initialGeneralStateForTest, {
            type: GeneralStateAction.SET_DRAWER_OPEN,
            payload: true,
        })
        expect(stateReturned).toStrictEqual({
            ...initialGeneralState,
            drawerOpen: true,
        })
    })
    it('should set drawerTab', () => {
        const stateReturned = GeneralStateReducer(initialGeneralStateForTest, {
            type: GeneralStateAction.SET_DRAWER_TAB,
            payload: DrawerTab.LINKS,
        })
        expect(stateReturned).toStrictEqual({
            ...initialGeneralState,
            drawerTab: DrawerTab.LINKS,
        })
    })
})
