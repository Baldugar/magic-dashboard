import { Backdrop, Fade, Modal, Paper } from '@mui/material'
import { Box } from '@mui/system'
import BoardCard from 'components/Board/BoardCard'
import React from 'react'
import colors from 'utils/colors'
import { Card, DECK_EDITOR_MODALS, MODAL_ACTION } from 'utils/types'

export interface CardDetailsModalProps {
    setModalState: (payload: { action: MODAL_ACTION; target: DECK_EDITOR_MODALS; message?: string }) => void
    open: boolean
    card: Card | undefined
}

const CardDetailsModal = (props: CardDetailsModalProps): JSX.Element => {
    const { open, card, setModalState } = props

    const handleCloseModal = () =>
        setModalState({ action: MODAL_ACTION.CLOSE, target: DECK_EDITOR_MODALS.CARD_DETAILS })

    if (card === undefined) {
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
                        {card.image_uris ? (
                            <BoardCard src={card.image_uris.border_crop} width={'20vw'} />
                        ) : card.card_faces ? (
                            <Box display={'flex'} flexDirection={'row'} style={{ columnGap: 12 }}>
                                {card.card_faces.map((cf, index) => (
                                    <BoardCard key={index} src={cf.image_uris?.border_crop} width={'20vw'} />
                                ))}
                            </Box>
                        ) : (
                            <BoardCard src={undefined} />
                        )}
                    </Paper>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CardDetailsModal
