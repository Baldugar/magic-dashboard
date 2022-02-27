import { Box, Chip } from '@mui/material'
import React from 'react'
import { MTGACard } from 'utils/types'

export interface SubtypeSelectorProps {
    searchTerm: string
    mtgaCreatureSubtypes: string[]
    selectedCreatureSubtype: string
    setSelectedCreatureSubtype: (subtype: string) => void
    selectedCreatures: MTGACard[]
}

const SubtypeSelector = (props: SubtypeSelectorProps): JSX.Element => {
    const { searchTerm, mtgaCreatureSubtypes, selectedCreatureSubtype, setSelectedCreatureSubtype } = props

    return (
        <>
            {mtgaCreatureSubtypes
                .filter((subtype: string) => subtype.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => a.localeCompare(b))
                .map((type) => (
                    <Box key={type}>
                        <Chip
                            color={selectedCreatureSubtype === type ? 'info' : 'default'}
                            clickable
                            label={type}
                            onClick={() => setSelectedCreatureSubtype(type)}
                        />
                    </Box>
                ))}
        </>
    )
}

export default SubtypeSelector
