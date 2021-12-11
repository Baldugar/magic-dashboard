import { Backdrop, Box, Button, Fade, Modal, Paper, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { Dispatch, MutableRefObject, SetStateAction } from 'react'
import colors from 'utils/colors'
import { submitDeck } from 'utils/funcs'
import { Deck, MODALS, MODAL_ACTION } from 'utils/types'

export interface DeckImporterModalProps {
    open: boolean
    setModalState: (payload: { action: MODAL_ACTION; target: MODALS; message?: string }) => void
    deckImportRef: MutableRefObject<HTMLTextAreaElement | undefined>
    setDeck: Dispatch<SetStateAction<Deck | undefined>>
}

const useStyles = makeStyles({
    scrollbar: {
        '&::-webkit-scrollbar': {
            width: '8px',
            backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': { backgroundColor: colors.main, borderRadius: '4px' },
    },
})

const DeckImporterModal = (props: DeckImporterModalProps): JSX.Element => {
    const { open, setModalState, deckImportRef, setDeck } = props
    const classes = useStyles()

    const handleCloseModal = () => setModalState({ action: MODAL_ACTION.CLOSE, target: MODALS.IMPORT_DECK })
    const handleOpenLoadingModal = () =>
        setModalState({ action: MODAL_ACTION.OPEN, target: MODALS.LOADING, message: 'Fetching Deck...' })

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
                    width={'50%'}
                    minWidth={'650px'}
                    sx={{
                        borderColor: 'secondary.main',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                    }}
                >
                    <Paper
                        className={classes.scrollbar}
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
                            <Typography variant={'h3'}>Deck import</Typography>
                            <Typography>Import with MTGA format</Typography>
                        </Box>
                        <Box
                            sx={{
                                maxHeight: '60vh',
                                overflowY: 'auto',
                            }}
                        >
                            <TextField
                                autoFocus
                                multiline
                                fullWidth
                                inputProps={{ ref: deckImportRef }}
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
                                    if ((e.ctrlKey || e.shiftKey) && e.key === 'Enter') {
                                        handleOpenLoadingModal()
                                        handleCloseModal()
                                        submitDeck(deckImportRef, setDeck, setModalState)
                                    }
                                }}
                            />
                        </Box>
                        <Button
                            variant={'contained'}
                            onClick={() => {
                                handleOpenLoadingModal()
                                handleCloseModal()
                                submitDeck(deckImportRef, setDeck, setModalState)
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

export default DeckImporterModal
