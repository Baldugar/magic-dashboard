import { CircularProgress } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider as Emotion10ThemeProvider } from '@emotion/react'
import { Suspense } from 'react'
import '../src/index.css'
import { ModifiedTheme } from '../src/utils/theme'

const withThemeProvider = (Story, context) => {
    return (
        <Emotion10ThemeProvider theme={ModifiedTheme}>
            <ThemeProvider theme={ModifiedTheme}>
                <Suspense fallback={<CircularProgress />}>
                    <Story {...context} />
                </Suspense>
            </ThemeProvider>
        </Emotion10ThemeProvider>
    )
}

export const decorators = [withThemeProvider, withKnobs]

// // ...other storybook exports
// // automatically import all files ending in *.stories.tsx
// const req = require.context('../src', true, /.stories.tsx$/)

// function loadStories() {
//     req.keys().forEach(req)
// }

// configure(loadStories, module)
