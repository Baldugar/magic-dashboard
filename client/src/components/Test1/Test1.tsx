import { Box, Typography } from '@mui/material'
import React from 'react'

export interface Test1Props {
    name: string
}

const Test1 = (props: Test1Props): JSX.Element => {
    const { name } = props

    return (
        <Box display={'flex'} height={'50px'} overflow={'hidden'} bgcolor={'transparent'}>
            <Box flex={3} bgcolor={'black'} height={'30px'}>
                <Typography>{name}</Typography>
            </Box>
            <Box flex={1} position={'relative'} bgcolor={'green'} height={'50px'}>
                <Box
                    position={'absolute'}
                    left={0}
                    height={'50px'}
                    width={'100px'}
                    bgcolor={'blue'}
                    style={{ transform: 'translateX(-100%) skew(34deg)' }}
                />
            </Box>
        </Box>
    )
}

export default Test1
