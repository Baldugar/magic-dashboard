import { CssBaseline, ThemeProvider } from '@material-ui/core'
import FirstPage from 'pages/FirstPage'
import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import store from 'store/store'
import { ModifiedTheme } from 'utils/theme'

function App(): JSX.Element {
    return (
        <HashRouter>
            <Provider store={store}>
                <ThemeProvider theme={ModifiedTheme}>
                    <Switch>
                        <Route exact={true} path={'/FirstPage'} component={FirstPage} />
                        <Route>
                            <Redirect from={'/'} to={'/FirstPage'} />
                        </Route>
                    </Switch>
                    <CssBaseline />
                </ThemeProvider>
            </Provider>
        </HashRouter>
    )
}

export default App
