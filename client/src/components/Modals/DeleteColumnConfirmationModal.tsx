import { Backdrop, Button, Fade, Modal, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { MODAL_ACTION, DECK_EDITOR_MODALS } from 'utils/types'
import colors from 'utils/colors'

export interface DeleteColumnConfirmationModalProps {
    setModalState: (payload: { action: MODAL_ACTION; target: DECK_EDITOR_MODALS; message?: string }) => void
    open: boolean
    confirmDeleteColumn: () => void
}

const DeleteColumnConfirmationModal = (props: DeleteColumnConfirmationModalProps): JSX.Element => {
    const { open, setModalState, confirmDeleteColumn } = props

    const handleCloseModal = () =>
        setModalState({ action: MODAL_ACTION.CLOSE, target: DECK_EDITOR_MODALS.DELETE_COLUMN_CONFIRMATION })

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
                            <Typography variant={'h3'}>Deleting Column</Typography>
                            <Typography>
                                {`Deleting a column will move all orphan cards to a column named "Unsorted", the program will create one if it doesn't exist. You can change this behavior using the menu options.`}
                            </Typography>
                        </Box>
                        <Button
                            variant={'contained'}
                            onClick={() => {
                                confirmDeleteColumn()
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

export default DeleteColumnConfirmationModal
