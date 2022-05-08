import { Box } from '@mui/system'
import { CardType } from 'graphql/types'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'

export interface RaritySelectorProps {
    selected: { [key in CardType]: TernaryBoolean }
    setSelected: (rarity: CardType) => void
    setSelectedPrev: (rarity: CardType) => void
    iconSize?: number
}

const RaritySelector = (props: RaritySelectorProps): JSX.Element => {
    const { selected, setSelected, setSelectedPrev, iconSize } = props
    return (
        <>
            {Object.values(CardType).map((ct) => {
                return (
                    <Box key={ct} display={'flex'} alignItems={'center'}>
                        <TernaryToggle
                            value={selected[ct]}
                            type={'icon'}
                            iconButtonProps={{
                                size: 'small',
                                onClick: () => setSelected(ct),
                                onContextMenu: () => setSelectedPrev(ct),
                            }}
                            imgProps={{
                                src: `/img/type/${ct}.png`,
                                width: iconSize ?? 40,
                                height: iconSize ?? 40,
                                style: { opacity: selected[ct] ? 1 : 0.3, transition: 'opacity 250ms' },
                            }}
                        />
                    </Box>
                )
            })}
        </>
    )
}

export default RaritySelector
