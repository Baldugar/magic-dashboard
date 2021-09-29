import { Typography } from '@material-ui/core'
import React from 'react'

const FirstPage = (): JSX.Element => {
    return (
        <div>
            <Typography style={{ alignSelf: 'center', padding: 32 }} variant={'h2'}>
                First page
            </Typography>
        </div>
    )
}

export default FirstPage
