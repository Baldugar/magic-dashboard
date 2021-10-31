import { Backdrop, CircularProgress, Fade, Modal, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import colors from 'utils/colors'

export interface LoadingModalProps {
    open: boolean
    message: string | undefined
}

const LoadingModal = (props: LoadingModalProps): JSX.Element => {
    const { open, message } = props

    return (
        <Modal
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box
                    position={'absolute'}
                    top={'50%'}
                    left={'50%'}
                    style={{ transform: 'translate(-50%, -50%)' }}
                    sx={{
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                    }}
                >
                    <Paper
                        sx={{
                            p: 4,
                            backgroundColor: colors.black,
                            color: colors.midGray,
                            rowGap: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                        {message && (
                            <Box>
                                <Typography color={'primary'} variant={'h3'}>
                                    {message}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Fade>
        </Modal>
    )
}

export default LoadingModal
