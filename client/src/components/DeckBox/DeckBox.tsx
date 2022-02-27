import { Box } from '@mui/system'
import React from 'react'
import { COLORS, RARITY, Wildcard } from 'utils/types'

export interface DeckBoxProps {
    color?: COLORS
    image?: string
    isValid: boolean
    name: string
    wildcards: {
        common: Wildcard<RARITY.COMMON>
        uncommon: Wildcard<RARITY.UNCOMMON>
        rare: Wildcard<RARITY.RARE>
        mythic: Wildcard<RARITY.MYTHIC>
    }
}

export const DeckBox = (): JSX.Element => {
    return <Box width={'280px'} height={'240px'} bgcolor={'teal'}></Box>
}

// Language: typescript
// Given 2 vectors, return if they cross in the same point
