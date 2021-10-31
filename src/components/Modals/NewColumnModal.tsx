import { Backdrop, Button, Fade, Modal, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { MutableRefObject } from 'react'
import colors from 'utils/colors'
import { MODAL_ACTION, MODALS } from 'utils/types'

export interface NewColumnModalProps {
    setModalState: (payload: { action: MODAL_ACTION; target: MODALS; message?: string }) => void
    newColumnRef: MutableRefObject<HTMLTextAreaElement | undefined>
    open: boolean
    createColumn: () => void
}

const NewColumnModal = (props: NewColumnModalProps): JSX.Element => {
    const { open, setModalState, newColumnRef, createColumn } = props

    const handleCloseModal = () => setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.NEW_COLUMN })

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
                            <Typography variant={'h3'}>Add Column</Typography>
                            <Typography>Write the column&apos;s name</Typography>
                        </Box>
                        <Box
                            sx={{
                                maxHeight: '60vh',
                                overflowY: 'auto',
                            }}
                        >
                            <TextField
                                autoFocus
                                fullWidth
                                inputProps={{ ref: newColumnRef }}
                                InputProps={{
                                    sx: {
                                        color: colors.midGray,
                                        borderColor: colors.midGray,
                                        borderWidth: '2px',
                                        borderStyle: 'solid',
                                        '&:hover': { borderColor: 'secondary.main' },
                                        transition: 'border-color 250ms',
                                        '& fieldset': { borderWidth: '0px !important' },
                                    },
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log('HERE')
                                        handleCloseModal()
                                        createColumn()
                                    }
                                }}
                            />
                        </Box>
                        <Button
                            variant={'contained'}
                            onClick={() => {
                                handleCloseModal()
                                createColumn()
                            }}
                        >
                            Submit
                        </Button>
                    </Paper>
                </Box>
            </Fade>
        </Modal>
    )
}

export default NewColumnModal
