import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useLoginState } from 'pages/Login/useLoginState'
import * as React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function SignIn() {
    const { handleSubmit, error } = useLoginState()
    const theme = createTheme()

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl" sx={{ backgroundColor: 'white', height: '100vh' }}>
                <CssBaseline />
                <Box
                    sx={{
                        paddingTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Sign In
                        </Button>
                        {error.length > 0 && (
                            <Typography component="h1" variant="h6" color={'error'} textAlign={'center'}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
