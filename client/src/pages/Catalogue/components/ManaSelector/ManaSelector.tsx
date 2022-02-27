import { Box } from '@mui/system'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'
import { COLORS } from 'utils/types'

export interface ManaSelectorProps {
    iconSize?: number
    selected: Record<COLORS, TernaryBoolean>
    setSelected: (color: COLORS) => void
    multi?: {
        value: TernaryBoolean
        selectMulti: () => void
    }
}

const ManaSelector = (props: ManaSelectorProps): JSX.Element => {
    const { iconSize, selected, setSelected, multi } = props

    return (
        <>
            {Object.values(COLORS).map((c) => (
                <Box key={c}>
                    <TernaryToggle
                        value={selected[c]}
                        type={'icon'}
                        iconButtonProps={{ size: 'small', onClick: () => setSelected(c) }}
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
                <Box>
                    <TernaryToggle
                        value={multi.value}
                        type={'icon'}
                        iconButtonProps={{ size: 'small', onClick: () => multi.selectMulti() }}
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
