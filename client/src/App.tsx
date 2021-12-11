import { CssBaseline, ThemeProvider } from '@mui/material'
import DeckEditor from 'pages/DeckEditor'
import LoginView from 'pages/LoginView'
import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import { Provider } from 'react-redux'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import store from 'store/store'
import { ModifiedTheme } from 'utils/theme'

function App(): JSX.Element {
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
                        <Switch>
                            <Route exact={true} path={'/DeckEditor'} component={DeckEditor} />
                            <Route exact={true} path={'/'} component={LoginView} />
                            <Route>
                                <Redirect to={'/'} />
                            </Route>
                        </Switch>
                        <CssBaseline />
                    </ThemeProvider>
                </Provider>
            </Auth0Provider>
        </HashRouter>
    )
}

export default App
