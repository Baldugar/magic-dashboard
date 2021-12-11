import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import SearchPanel from 'components/SearchPanel'

export const LoginView = (): JSX.Element => {
    const { loginWithRedirect, logout, user, getAccessTokenSilently } = useAuth0()
    if (user) {
        const { sub } = user
    }

    const a: number[] = Array(22).fill(0, 0, -1)

    const [x, setX] = useState<number>(Math.floor(window.innerWidth / 2) - 50)
    const [y, setY] = useState<number>(Math.floor(window.innerHeight / 2) - 50)

    return (
        <Box>
            <Button onClick={() => loginWithRedirect()}>LOGIN</Button>
            <Button onClick={() => logout()}>LOGOU</Button>
            {user && <Typography>{JSON.stringify(user)}</Typography>}
            <Button onClick={() => getAccessTokenSilently().then((token) => console.log('USER TOKEN', token))}>
                ACCTOKEN
            </Button>
            {/* <Box paddingX={3}>
                <Box display={'flex'} width={1} columnGap={3.5} rowGap={4} flexWrap={'wrap'}>
                    {a.map((_, i) => (
                        <DeckBox key={i} />
                    ))}
                </Box>
            </Box> */}
            <SearchPanel visible bgColor={'teal'} />
            <SearchPanel visible bgColor={'red'} />
            <SearchPanel visible bgColor={'green'} />
            <SearchPanel visible bgColor={'blue'} />
        </Box>
    )
}
