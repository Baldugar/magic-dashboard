import { Clear, Delete, FindReplace, Search, Star, StarBorder } from '@mui/icons-material'
import { Button, IconButton, InputAdornment, Popover, Rating, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { isEqual } from 'lodash'
import CMCSelector from 'pages/Catalogue/components/CMCSelector'
import ManaSelector from 'pages/Catalogue/components/ManaSelector'
import RaritySelector from 'pages/Catalogue/components/RaritySelector'
import TypeSelector from 'pages/Catalogue/components/TypeSelector'
import { MouseEvent, useState } from 'react'
import { CatalogueFilterType, initialCatalogueState } from 'store/CatalogueState/CatalogueState.reducer'
import { nextTB, prevTB } from 'utils/ternaryBoolean'

export interface CatalogueFilterProps {
    filter: CatalogueFilterType
    setFilter: (v: Partial<CatalogueFilterType>) => void
    clearFilter: () => void
}

const CatalogueFilter = (props: CatalogueFilterProps): JSX.Element => {
    const { filter, setFilter, clearFilter } = props

    const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null)
    const [ratingFilterAnchorEl, setRatingFilterAnchorEl] = useState<Element | null>(null)

    const [search, setSearch] = useState<string>('')
    const [minRating, setMinRating] = useState<number | null>(null)
    const [maxRating, setMaxRating] = useState<number | null>(null)

    const searchOpen = Boolean(searchAnchorEl)
    const ratingFilterOpen = Boolean(ratingFilterAnchorEl)
    const openSearchMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setSearchAnchorEl(event.currentTarget)
    }
    const openRatingFilterMenu = (e: MouseEvent<HTMLButtonElement>) => setRatingFilterAnchorEl(e.currentTarget)
    const closeSearchMenu = () => {
        setSearchAnchorEl(null)
    }
    const closeRatingFilterMenu = () => setRatingFilterAnchorEl(null)

    return (
        <Box display={'flex'}>
            <Box display={'flex'} columnGap={'4px'} paddingLeft={2}>
                <Box>
                    <IconButton size={'small'} onClick={openSearchMenu}>
                        {filter.searchString === initialCatalogueState.filter.searchString ? (
                            <Search style={{ width: 40, height: 40 }} />
                        ) : (
                            <FindReplace style={{ width: 40, height: 40 }} />
                        )}
                    </IconButton>
                    <Popover
                        anchorEl={searchAnchorEl}
                        open={searchOpen}
                        onClose={closeSearchMenu}
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
                                        closeSearchMenu()
                                    }
                                }}
                            />
                            <Box display={'flex'} columnGap={1} marginTop={1}>
                                <Button
                                    variant={'contained'}
                                    onClick={() => {
                                        setFilter({ searchString: search })
                                        closeSearchMenu()
                                    }}
                                >
                                    Search
                                </Button>
                                <Button
                                    variant={'contained'}
                                    onClick={() => {
                                        setSearch('')
                                        setFilter({ searchString: '' })
                                        closeSearchMenu()
                                    }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
                </Box>
                <Box>
                    <IconButton size={'small'} onClick={openRatingFilterMenu}>
                        {isEqual(filter.rating, initialCatalogueState.filter.rating) ? (
                            <StarBorder style={{ width: 40, height: 40 }} />
                        ) : (
                            <Star style={{ width: 40, height: 40 }} />
                        )}
                    </IconButton>
                    <Popover
                        anchorEl={ratingFilterAnchorEl}
                        open={ratingFilterOpen}
                        onClose={closeRatingFilterMenu}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box padding={2} maxWidth={500}>
                            <Box display={'flex'} flexDirection={'column'} rowGap={1}>
                                <Box>
                                    <Typography component="legend">Min rating</Typography>
                                    <Rating
                                        value={minRating}
                                        onChange={(_, rating) => {
                                            if (rating) {
                                                setMinRating(rating)
                                                if (maxRating && rating > maxRating) {
                                                    setMaxRating(rating)
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography component="legend">Max rating</Typography>
                                    <Rating
                                        value={maxRating}
                                        onChange={(_, rating) => {
                                            if (rating) {
                                                setMaxRating(rating)
                                                if (minRating && rating < minRating) {
                                                    setMinRating(rating)
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box display={'flex'} columnGap={1} marginTop={1}>
                                <Button
                                    variant={'contained'}
                                    onClick={() => {
                                        setFilter({
                                            rating: {
                                                max: maxRating,
                                                min: minRating,
                                            },
                                        })
                                        closeRatingFilterMenu()
                                    }}
                                >
                                    Filter
                                </Button>
                                <Button
                                    variant={'contained'}
                                    onClick={() => {
                                        setMinRating(null)
                                        setMaxRating(null)
                                    }}
                                >
                                    Clear Values
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
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
                <Box marginLeft={'auto'}>
                    <IconButton size={'small'} onClick={clearFilter}>
                        <Delete style={{ width: 40, height: 40 }} />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default CatalogueFilter
