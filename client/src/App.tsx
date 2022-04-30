import { Chip, CssBaseline, IconButton, ThemeProvider } from '@mui/material'
import React, { useCallback } from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import store, { AppState } from 'store/store'
import { ModifiedTheme } from 'utils/theme'
import { Box } from '@mui/system'
import Catalogue from 'pages/Catalogue'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { Dispatch } from 'redux'
import GeneralStateActions, { GeneralStateAction } from 'store/GeneralState/GeneralState.actions'

const BottomNavBar = (props: { navLinks: { path: string; label: string; component: JSX.Element }[] }) => {
    const { navLinks } = props
    const navigate = useNavigate()
    const {
        generalState: { bottomBarOpened: open },
    } = useSelector((appState: AppState) => ({
        generalState: appState.generalState,
    }))
    const dispatch = useDispatch<Dispatch<GeneralStateActions>>()
    const setOpen = useCallback(
        (payload: boolean) => {
            dispatch({ type: GeneralStateAction.SET_BOTTOM_BAR_STATE, payload })
        },
        [dispatch],
    )
    return (
        <Box
            position={'fixed'}
            bottom={open ? 0 : -50}
            left={0}
            right={0}
            height={50}
            bgcolor={'teal'}
            zIndex={10000}
            display={'flex'}
            flexDirection={'row'}
            columnGap={'30px'}
            alignItems={'center'}
            paddingX={'20px'}
            style={{
                transition: 'bottom 250ms',
            }}
        >
            <Box
                position={'absolute'}
                bottom={50}
                // bottom={50}
                // height={10}
                marginLeft={'auto'}
                marginRight={'auto'}
                width={'40px'}
                left={0}
                right={0}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                style={{
                    transition: 'bottom 250ms',
                }}
            >
                <IconButton
                    size={'small'}
                    onClick={() => setOpen(open ? false : true)}
                    style={{ transition: 'transform 250ms', transform: open ? 'rotate(180deg)' : '' }}
                >
                    <ArrowUpwardIcon style={{ color: 'red' }} />
                </IconButton>
            </Box>
            {navLinks.map((link) => (
                <Box key={link.path}>
                    <Chip label={link.label} onClick={() => navigate(link.path)} />
                </Box>
            ))}
        </Box>
    )
}

function App(): JSX.Element {
    const navLinks: { path: string; label: string; component: JSX.Element }[] = [
        { path: '/catalogue', label: 'Catalogue', component: <Catalogue /> },
    ]

    return (
        <HashRouter>
            <Auth0Provider
                domain="dev-3h8tu4ep.eu.auth0.com"
                clientId="y4HQ47fZ4u5m7ExMFLwH3KGRwt8fTeRe"
                redirectUri={window.location.origin}
                audience="https://dev-3h8tu4ep.eu.auth0.com/api/v2/"
                scope="read:current_user update:current_user_metadata"
            >
                <Provider store={store}>
                    <ThemeProvider theme={ModifiedTheme}>
                        <Routes>
                            {navLinks.map((link) => (
                                <Route key={link.path} path={link.path} element={link.component} />
                            ))}
                            <Route path={'/'} element={<Navigate to={'/catalogue'} />} />
                        </Routes>
                        <BottomNavBar navLinks={navLinks} />
                        <CssBaseline />
                    </ThemeProvider>
                </Provider>
            </Auth0Provider>
        </HashRouter>
    )
}

export default App
