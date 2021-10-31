import { Backdrop, Button, Fade, Modal, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import colors from 'utils/colors'
import { MODAL_ACTION, MODALS } from 'utils/types'

export interface DeleteCardConfirmationModalProps {
    setModalState: (payload: { action: MODAL_ACTION; target: MODALS; message?: string }) => void
    open: boolean
    confirmDeleteCard: () => void
}

const DeleteCardConfirmationModal = (props: DeleteCardConfirmationModalProps): JSX.Element => {
    const { open, setModalState, confirmDeleteCard } = props

    const handleCloseModal = () =>
        setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.DELETE_CARD_CONFIRMATION })

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
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
                        borderColor: 'secondary.main',
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
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant={'h3'}>Removing last card</Typography>
                            <Typography>
                                Removing the last copy of a card will delete the card from the deck, are you sure?
                            </Typography>
                            <Typography>You can disable this warning in the settings menu</Typography>
                        </Box>
                        <Button
                            variant={'contained'}
                            onClick={() => {
                                confirmDeleteCard()
                                handleCloseModal()
                            }}
                        >
                            Confirm
                        </Button>
                    </Paper>
                </Box>
            </Fade>
        </Modal>
    )
}

export default DeleteCardConfirmationModal
