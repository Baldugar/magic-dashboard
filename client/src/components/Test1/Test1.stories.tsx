import { ThemeProvider } from '@mui/material'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Test1 from 'components/Test1/Test1'
import * as React from 'react'
import { ModifiedTheme } from 'utils/theme'

const stories = storiesOf('BoardTable', module)

stories.addDecorator(withKnobs)
stories.add('default view', () => (
    <ThemeProvider theme={ModifiedTheme}>
        <Test1 name={'test'} />
    </ThemeProvider>
))
