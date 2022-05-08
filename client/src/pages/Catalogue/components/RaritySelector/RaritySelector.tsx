import { Box } from '@mui/system'
import { Rarity } from 'graphql/types'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'

export interface RaritySelectorProps {
    selected: { [key in Rarity]: TernaryBoolean }
    setSelected: (rarity: Rarity) => void
    setSelectedPrev: (rarity: Rarity) => void
    iconSize?: number
}

const RaritySelector = (props: RaritySelectorProps): JSX.Element => {
    const { selected, setSelected, setSelectedPrev, iconSize } = props
    return (
        <>
            {Object.values(Rarity).map((r) => {
                return (
                    <Box key={r} display={'flex'} alignItems={'center'}>
                        <TernaryToggle
                            value={selected[r]}
                            type={'icon'}
                            iconButtonProps={{
                                size: 'small',
                                onClick: () => setSelected(r),
                                onContextMenu: () => setSelectedPrev(r),
                            }}
                            imgProps={{
                                src: `/img/rarity/${r}.png`,
                                width: iconSize ?? 40,
                                height: iconSize ?? 40,
                                style: { opacity: selected[r] ? 1 : 0.3, transition: 'opacity 250ms' },
                            }}
                        />
                    </Box>
                )
            })}
        </>
    )
}

export default RaritySelector
