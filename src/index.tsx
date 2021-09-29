import { Box, CircularProgress, Grid } from '@material-ui/core'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

ReactDOM.render(
    <Suspense
        fallback={
            <Grid container item xs={12}>
                <Box
                    height={1}
                    width={1}
                    display={'flex'}
                    justifyContent={'center'}
                    alignContent={'center'}
                    marginTop={'calc(100vh / 2)'}
                >
                    <CircularProgress size={80} />
                </Box>
            </Grid>
        }
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Suspense>,
    document.getElementById('root'),
)
