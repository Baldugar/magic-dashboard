import { Box } from '@mui/system'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'
import { CARD_TYPES } from 'utils/types'

export interface TypeSelectorProps {
    selected: { [key in CARD_TYPES]: TernaryBoolean }
    setSelected: (cardType: CARD_TYPES) => void
}

const TypeSelector = (props: TypeSelectorProps): JSX.Element => {
    const { selected, setSelected } = props
    return (
        <>
            {Object.values(CARD_TYPES).map((t) => {
                return (
                    <Box key={t}>
                        <TernaryToggle
                            value={selected[t]}
                            type={'checkbox'}
                            labelProps={{
                                label: t,
                                labelPlacement: 'start',
                            }}
                            checkboxProps={{
                                onChange: () => setSelected(t),
                            }}
                        />
                    </Box>
                )
            })}
        </>
    )
}

export default TypeSelector
