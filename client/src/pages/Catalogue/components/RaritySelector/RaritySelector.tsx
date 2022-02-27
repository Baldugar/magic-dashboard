import { Box } from '@mui/system'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'
import { RARITY } from 'utils/types'

export interface RaritySelectorProps {
    selected: { [key in RARITY]: TernaryBoolean }
    setSelected: (rarity: RARITY) => void
}

const RaritySelector = (props: RaritySelectorProps): JSX.Element => {
    const { selected, setSelected } = props
    return (
        <>
            {Object.values(RARITY).map((r) => {
                return (
                    <Box key={r}>
                        <TernaryToggle
                            value={selected[r]}
                            type={'icon'}
                            iconButtonProps={{ size: 'small', onClick: () => setSelected(r) }}
                            imgProps={{
                                src: `/img/rarity/${r}.png`,
                                width: 40,
                                height: 40,
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
