import { Delete, Search } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import { Box } from '@mui/system'
import ManaSelector from 'pages/Catalogue/components/ManaSelector'
import RaritySelector from 'pages/Catalogue/components/RaritySelector'
import React from 'react'
import { CatalogueFilterType } from 'store/CatalogueState/CatalogueState.reducer'
import { nextTB } from 'utils/ternaryBoolean'
import { RARITY } from 'utils/types'

export interface CatalogueFilterProps {
    onOpenClick: () => void
    filter: CatalogueFilterType
    setFilter: (v: Partial<CatalogueFilterType>) => void
    clearFilter: () => void
}

const CatalogueFilter = (props: CatalogueFilterProps): JSX.Element => {
    const { filter, onOpenClick, setFilter, clearFilter } = props

    const selected = filter.rarity
    const setSelected = (r: RARITY) => {
        const newFilter = { ...filter }
        newFilter.rarity[r] = nextTB(newFilter.rarity[r])
        setFilter(newFilter)
    }

    return (
        <Box display={'flex'} flexDirection={'column'} rowGap={'8px'} padding={2}>
            <Box display={'flex'} columnGap={'4px'}>
                <ManaSelector
                    selected={{ ...filter.color }}
                    setSelected={(c) => {
                        const newFilter = { ...filter }
                        newFilter.color[c] = nextTB(newFilter.color[c])
                        setFilter(newFilter)
                    }}
                    multi={{
                        value: filter.multiColor,
                        selectMulti: () => {
                            const newFilter = { ...filter }
                            newFilter.multiColor = nextTB(newFilter.multiColor)
                            setFilter(newFilter)
                        },
                    }}
                />
                <Box>
                    <IconButton size={'small'} onClick={onOpenClick}>
                        <Search style={{ width: 40, height: 40 }} />
                    </IconButton>
                </Box>
                <Box marginLeft={'auto'}>
                    <IconButton size={'small'} onClick={clearFilter}>
                        <Delete style={{ width: 40, height: 40 }} />
                    </IconButton>
                </Box>
            </Box>
            <Box display={'flex'} columnGap={'4px'}>
                <Box flex={1}>
                    <TextField
                        label={'Search'}
                        variant={'filled'}
                        fullWidth
                        onChange={(e) => setFilter({ searchString: e.target.value })}
                        value={filter.searchString}
                    />
                </Box>
                <Box display={'flex'} columnGap={'4px'} justifyContent={'flex-end'}>
                    <RaritySelector selected={selected} setSelected={setSelected} />
                </Box>
            </Box>
        </Box>
    )
}

export default CatalogueFilter
