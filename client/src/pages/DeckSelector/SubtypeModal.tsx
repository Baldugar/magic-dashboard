import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material'
import CardWithHover from 'components/CardWithHover'
import React from 'react'
import { MTGACard } from 'utils/types'

export interface SubtypeModalProps {
    selectedCreatureSubtype: string
    setSelectedCreatureSubtype: (subtype: string) => void
    mtgaCreatures: MTGACard[]
    selectedCreatures: MTGACard[]
    toggleCreatureSelection: (card: MTGACard) => void
}

const SubtypeModal = (props: SubtypeModalProps): JSX.Element => {
    const {
        selectedCreatureSubtype,
        setSelectedCreatureSubtype,
        mtgaCreatures,
        selectedCreatures,
        toggleCreatureSelection,
    } = props

    return (
        <Dialog
            scroll={'paper'}
            open={selectedCreatureSubtype.length > 0}
            onClose={() => setSelectedCreatureSubtype('')}
            style={{ maxHeight: '80vh' }}
        >
            <DialogTitle>{selectedCreatureSubtype}</DialogTitle>
            <DialogContent>
                <Box display={'flex'} flexWrap={'wrap'} rowGap={'20px'} columnGap={'20px'}>
                    {mtgaCreatures
                        .filter(
                            (card) =>
                                card.type_line.includes(selectedCreatureSubtype) && selectedCreatureSubtype !== '',
                        )
                        .map((card) => (
                            <Box key={card.id}>
                                {card.image_uris && (
                                    <CardWithHover
                                        card={card}
                                        onClick={() => toggleCreatureSelection(card)}
                                        selected={selectedCreatures.includes(card)}
                                    />
                                )}
                            </Box>
                        ))}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default SubtypeModal
