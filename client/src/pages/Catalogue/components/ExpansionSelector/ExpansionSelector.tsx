import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { sortBy } from 'lodash'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { TernaryBoolean } from 'utils/ternaryBoolean'

export interface ExpansionSelectorProps {
    expansions: { set: string; set_name: string; released_at: string }[]
    selected: { [key: string]: TernaryBoolean }
    setSelected: (expansion: string) => void
}

const ExpansionSelector = (props: ExpansionSelectorProps): JSX.Element => {
    const { expansions, selected, setSelected } = props
    return (
        <>
            {sortBy(expansions, 'released_at')
                .reverse()
                .map((e) => {
                    return (
                        <TernaryToggle
                            type={'checkbox'}
                            value={selected[e.set]}
                            key={e.set}
                            labelProps={{
                                label: (
                                    <Box display={'flex'} columnGap={2}>
                                        <img
                                            src={`/img/sets/${e.set}.svg`}
                                            onError={({ currentTarget }) => {
                                                currentTarget.style.display = 'none'
                                            }}
                                            alt={''}
                                            width={32}
                                            loading={'lazy'}
                                        />
                                        <Typography>{e.set_name}</Typography>
                                    </Box>
                                ),
                                labelPlacement: 'end',
                            }}
                            checkboxProps={{
                                onChange: () => setSelected(e.set),
                            }}
                        />
                    )
                })}
        </>
    )
}

export default ExpansionSelector
