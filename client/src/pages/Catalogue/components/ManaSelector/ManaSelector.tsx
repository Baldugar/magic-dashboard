import { Box } from '@mui/system'
import { Color } from 'graphql/types'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'

export interface ManaSelectorProps {
    iconSize?: number
    selected: Record<Color, TernaryBoolean>
    setSelected: (color: Color) => void
    setSelectedPrev: (color: Color) => void
    multi?: {
        value: TernaryBoolean
        selectMulti: () => void
        selectPrevMulti: () => void
    }
}

const ManaSelector = (props: ManaSelectorProps): JSX.Element => {
    const { iconSize, selected, setSelected, multi, setSelectedPrev } = props

    return (
        <>
            {Object.values(Color).map((c) => (
                <Box key={c} display={'flex'} alignItems={'center'}>
                    <TernaryToggle
                        value={selected[c]}
                        type={'icon'}
                        iconButtonProps={{
                            size: 'small',
                            onClick: () => setSelected(c),
                            onContextMenu: () => setSelectedPrev(c),
                        }}
                        imgProps={{
                            src: `/img/mana/${c}.svg`,
                            width: iconSize ?? 40,
                            height: iconSize ?? 40,
                            style: { opacity: selected[c] ? 1 : 0.3, transition: 'opacity 250ms' },
                        }}
                    />
                </Box>
            ))}
            {multi && (
                <Box display={'flex'} alignItems={'center'}>
                    <TernaryToggle
                        value={multi.value}
                        type={'icon'}
                        iconButtonProps={{
                            size: 'small',
                            onClick: () => multi.selectMulti(),
                            onContextMenu: () => multi.selectPrevMulti(),
                        }}
                        imgProps={{
                            src: `/img/mana/multi.svg`,
                            width: iconSize ?? 40,
                            height: iconSize ?? 40,
                            style: { opacity: multi.value ? 1 : 0.3, transition: 'opacity 250ms' },
                        }}
                    />
                </Box>
            )}
        </>
    )
}

export default ManaSelector
