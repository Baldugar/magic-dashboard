import { Delete } from '@mui/icons-material'
import { Backdrop, Button, Fade, IconButton, Modal, Paper, TextField, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { MutableRefObject } from 'react'
import colors from 'utils/colors'
import { MODAL_ACTION, DECK_EDITOR_MODALS } from 'utils/types'

export interface EditColumnModalProps {
    setModalState: (payload: { action: MODAL_ACTION; target: DECK_EDITOR_MODALS; message?: string }) => void
    editColumnRef: MutableRefObject<HTMLTextAreaElement | undefined>
    open: boolean
    columnToEdit:
        | {
              columnIndex: number
              name: string
          }
        | undefined
    editColumn: () => void
}

const EditColumnModal = (props: EditColumnModalProps): JSX.Element => {
    const { open, setModalState, editColumnRef, editColumn, columnToEdit } = props

    const handleCloseModal = () => setModalState({ action: MODAL_ACTION.CLOSE, target: DECK_EDITOR_MODALS.EDIT_COLUMN })
    const handleOpenDeleteConfirmationModal = () =>
        setModalState({ action: MODAL_ACTION.OPEN, target: DECK_EDITOR_MODALS.DELETE_COLUMN_CONFIRMATION })

    if (columnToEdit === undefined) {
        return <div />
    }

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
                            <Typography variant={'h3'}>Edit or Delete Column</Typography>
                            <Typography>
                                Edit the column&apos;s name, you can click on the trash icon to delete the column.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                display: 'flex',
                            }}
                        >
                            <TextField
                                autoFocus
                                defaultValue={columnToEdit.name}
                                fullWidth
                                inputProps={{ ref: editColumnRef }}
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
                                        handleCloseModal()
                                        editColumn()
                                    }
                                }}
                            />
                            <Box marginLeft={2} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Tooltip title={'Delete Column'}>
                                    <IconButton color={'primary'} onClick={handleOpenDeleteConfirmationModal}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        <Button
                            variant={'contained'}
                            onClick={() => {
                                handleCloseModal()
                                editColumn()
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

export default EditColumnModal
