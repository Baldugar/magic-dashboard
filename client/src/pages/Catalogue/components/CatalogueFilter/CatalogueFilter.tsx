import { Clear, Delete, Search } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, Popover, TextField } from '@mui/material'
import { Box } from '@mui/system'
import CMCSelector from 'pages/Catalogue/components/CMCSelector'
import ManaSelector from 'pages/Catalogue/components/ManaSelector'
import RaritySelector from 'pages/Catalogue/components/RaritySelector'
import TypeSelector from 'pages/Catalogue/components/TypeSelector'
import { useState } from 'react'
import { CatalogueFilterType } from 'store/CatalogueState/CatalogueState.reducer'
import { nextTB, prevTB } from 'utils/ternaryBoolean'

export interface CatalogueFilterProps {
    filter: CatalogueFilterType
    setFilter: (v: Partial<CatalogueFilterType>) => void
    clearFilter: () => void
}

const CatalogueFilter = (props: CatalogueFilterProps): JSX.Element => {
    const { filter, setFilter, clearFilter } = props

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [search, setSearch] = useState<string>('')

    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box display={'flex'}>
            <Box display={'flex'} columnGap={'4px'} paddingLeft={2}>
                <Box>
                    <IconButton size={'small'} onClick={handleClick}>
                        <Search style={{ width: 40, height: 40 }} />
                    </IconButton>
                    <Popover
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box padding={2} maxWidth={500}>
                            <TextField
                                autoFocus
                                variant={'outlined'}
                                label={'Search'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setSearch('')}>
                                                <Clear />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                helperText={
                                    'You can search for a card name, you can use r:rarity, t:type or subtype, cmc:number you can do multiple searchs separated by ";", all searchs are treated as AND'
                                }
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        setFilter({ searchString: search })
                                        handleClose()
                                    }
                                }}
                            />
                            <Box display={'flex'} columnGap={1} marginTop={1}>
                                <Button
                                    variant={'contained'}
                                    onClick={() => {
                                        setFilter({ searchString: search })
                                        handleClose()
                                    }}
                                >
                                    Search
                                </Button>
                                <Button
                                    variant={'contained'}
                                    onClick={() => {
                                        setSearch('')
                                        setFilter({ searchString: '' })
                                        handleClose()
                                    }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
                </Box>
                <Box marginLeft={'auto'}>
                    <IconButton size={'small'} onClick={clearFilter}>
                        <Delete style={{ width: 40, height: 40 }} />
                    </IconButton>
                </Box>
                <ManaSelector
                    iconSize={30}
                    selected={{ ...filter.color }}
                    setSelected={(c) => {
                        const newFilter = { ...filter }
                        newFilter.color[c] = nextTB(newFilter.color[c])
                        setFilter(newFilter)
                    }}
                    setSelectedPrev={(c) => {
                        const newFilter = { ...filter }
                        newFilter.color[c] = prevTB(newFilter.color[c])
                        setFilter(newFilter)
                    }}
                    multi={{
                        value: filter.multiColor,
                        selectMulti: () => {
                            const newFilter = { ...filter }
                            newFilter.multiColor = nextTB(newFilter.multiColor)
                            setFilter(newFilter)
                        },
                        selectPrevMulti: () => {
                            const newFilter = { ...filter }
                            newFilter.multiColor = prevTB(newFilter.multiColor)
                            setFilter(newFilter)
                        },
                    }}
                />
                <CMCSelector
                    iconSize={30}
                    selected={{ ...filter.manaCosts }}
                    setSelected={(c) => {
                        const newFilter = { ...filter }
                        newFilter.manaCosts[c] = nextTB(newFilter.manaCosts[c])
                        setFilter(newFilter)
                    }}
                    setSelectedPrev={(c) => {
                        const newFilter = { ...filter }
                        newFilter.manaCosts[c] = prevTB(newFilter.manaCosts[c])
                        setFilter(newFilter)
                    }}
                />
                <RaritySelector
                    iconSize={30}
                    selected={{ ...filter.rarity }}
                    setSelected={(r) => {
                        const newFilter = { ...filter }
                        newFilter.rarity[r] = nextTB(newFilter.rarity[r])
                        setFilter(newFilter)
                    }}
                    setSelectedPrev={(r) => {
                        const newFilter = { ...filter }
                        newFilter.rarity[r] = prevTB(newFilter.rarity[r])
                        setFilter(newFilter)
                    }}
                />
                <TypeSelector
                    iconSize={30}
                    selected={{ ...filter.cardTypes }}
                    setSelected={(t) => {
                        const newFilter = { ...filter }
                        newFilter.cardTypes[t] = nextTB(newFilter.cardTypes[t])
                        setFilter(newFilter)
                    }}
                    setSelectedPrev={(t) => {
                        const newFilter = { ...filter }
                        newFilter.cardTypes[t] = prevTB(newFilter.cardTypes[t])
                        setFilter(newFilter)
                    }}
                />
            </Box>
        </Box>
    )
}

export default CatalogueFilter
