import { TextField } from '@material-ui/core'
import { Portal } from '@mui/material'
import { Box } from '@mui/system'
import SubtypeModal from 'pages/DeckSelector/SubtypeModal'
import SubtypeSelector from 'pages/DeckSelector/SubtypeSelector'
import { useDeckSelectorState } from 'pages/DeckSelector/useDeckSelectorState'
import React, { useState } from 'react'
import { MTGACard } from 'utils/types'

export const DeckSelector = (): JSX.Element => {
    const { mtgaCreatureSubtypes, mtgaCreatures, selectedCreatureSubtype, setSelectedCreatureSubtype } =
        useDeckSelectorState()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCreatures, setSelectedCreatures] = useState<MTGACard[]>([])

    return (
        <Box>
            <Box width={'50%'} margin={'0 auto'} bgcolor={'white'}>
                <TextField
                    label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    variant={'filled'}
                />
            </Box>
            <Box bgcolor={'#84878a'} width={1} p={'20px'}>
                <Box
                    width={'50%'}
                    margin={'0 auto'}
                    display={'flex'}
                    rowGap={'20px'}
                    columnGap={'20px'}
                    flexWrap={'wrap'}
                >
                    <SubtypeSelector
                        searchTerm={searchTerm}
                        mtgaCreatureSubtypes={mtgaCreatureSubtypes}
                        selectedCreatureSubtype={selectedCreatureSubtype}
                        setSelectedCreatureSubtype={setSelectedCreatureSubtype}
                        selectedCreatures={selectedCreatures}
                    />
                </Box>
                <Portal>
                    <SubtypeModal
                        selectedCreatureSubtype={selectedCreatureSubtype}
                        setSelectedCreatureSubtype={setSelectedCreatureSubtype}
                        mtgaCreatures={mtgaCreatures}
                        selectedCreatures={selectedCreatures}
                        toggleCreatureSelection={(card) => {
                            const newSelectedCreatures = selectedCreatures.slice()
                            const index = newSelectedCreatures.findIndex((c) => c.id === card.id)
                            if (index === -1) {
                                newSelectedCreatures.push(card)
                            } else {
                                newSelectedCreatures.splice(index, 1)
                            }
                            setSelectedCreatures(newSelectedCreatures)
                        }}
                    />
                </Portal>
            </Box>
        </Box>
    )
}
