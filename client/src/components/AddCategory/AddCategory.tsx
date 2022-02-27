import { Delete } from '@mui/icons-material'
import { Button, IconButton, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { isEqual } from 'lodash'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { CardCategory, COLORS } from 'utils/types'
import { v4 as uuid } from 'uuid'

export interface AddCategoryProps {
    categories: CardCategory[]
    onAdd: (category: CardCategory) => void
}

export interface ManaSelectorProps {
    selected: Record<COLORS, boolean>
    setSelected: Dispatch<SetStateAction<Record<COLORS, boolean>>>
}

const ManaSelector = (props: ManaSelectorProps): JSX.Element => {
    const { selected, setSelected } = props

    return (
        <Box>
            {Object.values(COLORS).map((c) => (
                <IconButton
                    onClick={() =>
                        setSelected(() => {
                            const newSelected = { ...selected }
                            newSelected[c] = !newSelected[c]
                            return newSelected
                        })
                    }
                    size={'small'}
                    key={c}
                >
                    <img
                        src={`/img/mana/${c}.svg`}
                        width={40}
                        height={40}
                        style={{ opacity: selected[c] ? 1 : 0.7, transition: 'opacity 250ms' }}
                    />
                </IconButton>
            ))}
        </Box>
    )
}

const AddCategory = (props: AddCategoryProps): JSX.Element => {
    const { categories, onAdd } = props

    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const [selected, setSelected] = useState<{ [key in COLORS]: boolean }>({
        B: false,
        U: false,
        R: false,
        G: false,
        W: false,
        C: false,
    })

    const clear = () => {
        setName('')
        setSelected({
            B: false,
            U: false,
            R: false,
            G: false,
            W: false,
            C: false,
        })
        setError('')
    }

    return (
        <Box paddingY={2} paddingX={2}>
            <Box display={'flex'}>
                <ManaSelector selected={selected} setSelected={setSelected} />
                <Box marginLeft={'auto'}>
                    <IconButton size={'small'} onClick={clear}>
                        <Delete style={{ width: 40, height: 40 }} />
                    </IconButton>
                </Box>
            </Box>
            <Box display={'flex'} rowGap={2} flexDirection={'column'}>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => {
                        if (error !== '') {
                            setError('')
                        }
                        if (e.key === 'Enter') {
                            const catToAdd = {
                                id: uuid(),
                                colors: Object.entries(selected)
                                    .filter((e) => e[1])
                                    .map((e) => e[0]) as COLORS[],
                                name,
                            }
                            if (categories.find((c) => c.name === name && isEqual(c.colors, catToAdd.colors))) {
                                setError('Category already exists')
                            } else {
                                onAdd(catToAdd)
                            }
                        }
                    }}
                    fullWidth
                    variant={'filled'}
                    label={'Category name'}
                    error={!!error}
                    helperText={error}
                />
                <Button
                    variant={'contained'}
                    onClick={() => {
                        const catToAdd = {
                            id: uuid(),
                            colors: Object.entries(selected)
                                .filter((e) => e[1])
                                .map((e) => e[0]) as COLORS[],
                            name,
                        }
                        if (categories.find((c) => c.name === name && isEqual(c.colors, catToAdd.colors))) {
                            setError('Category already exists')
                        } else {
                            onAdd(catToAdd)
                        }
                    }}
                >
                    Add
                </Button>
            </Box>
        </Box>
    )
}

export default AddCategory
