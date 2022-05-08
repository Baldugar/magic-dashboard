import { Box, CircularProgress, Grid } from '@mui/material'
import React, { Suspense } from 'react'
import App from './App'
import './index.css'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!) // createRoot(container!) if you use TypeScript
root.render(
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
)
