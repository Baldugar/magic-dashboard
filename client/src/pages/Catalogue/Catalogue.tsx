import { NavigateBefore, NavigateNext } from '@mui/icons-material'
import {
    Button,
    ClickAwayListener,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Popper,
    Select,
    Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import CardWithHover from 'components/CardWithHover'
import { cloneDeep } from 'lodash'
import CatalogueFilter from 'pages/Catalogue/components/CatalogueFilter'
import { useCatalogueDatabaseState } from 'pages/Catalogue/useCatalogueDatabaseState'
import { MouseEvent, useState } from 'react'
import { initialCatalogueState, SortDirection, SortEnum } from 'store/CatalogueState/CatalogueState.reducer'
import { PAGE_SIZE } from 'utils/constants'
import { nextTB, TernaryBoolean } from 'utils/ternaryBoolean'
import { Color, Set } from 'graphql/types'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import { NewCategoryInput } from 'pages/Catalogue/components/NewCategoryInput/NewCategoryInput'

const Catalogue = (): JSX.Element => {
    const {
        allCards,
        done,
        cardsToShow,
        page,
        firstPage,
        lastPage,
        nextPage,
        prevPage,
        disableNext,
        setFilter,
        filter,
        changeSortBy,
        changeSortDirection,
        sortBy,
        sortDirection,
    } = useCatalogueDatabaseState()

    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    const [subAnchorEl, setSubAnchorEl] = useState<Element | null>(null)

    const open = Boolean(anchorEl)
    const subOpen = Boolean(subAnchorEl)
    const openCategoryMenu = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)
    const openNewCategoryMenu = (e: MouseEvent<HTMLLIElement>) => {
        if (subOpen) {
            setSubAnchorEl(null)
        } else {
            setSubAnchorEl(e.currentTarget)
        }
    }
    const closeCategoryMenu = () => {
        setAnchorEl(null)
        setSubAnchorEl(null)
    }
    const closeNewCategoryMenu = () => setSubAnchorEl(null)

    if (!done) {
        return <div>Loading...</div>
    }

    return (
        <Box
            width={'100vw'}
            height={'100vh'}
            maxHeight={'100vh'}
            overflow={'hidden'}
            bgcolor={'pink'}
            display={'flex'}
            flexDirection={'column'}
        >
            <Box
                minHeight={'70px'}
                display={'flex'}
                alignItems={'center'}
                paddingX={'10px'}
                justifyContent={'space-between'}
            >
                <Box display={'flex'} alignItems={'center'}>
                    <Button onClick={openCategoryMenu} variant={'contained'}>
                        Categories
                    </Button>
                    <Popper anchorEl={anchorEl} open={open}>
                        <ClickAwayListener onClickAway={closeCategoryMenu}>
                            <div>
                                <MenuItem onClick={openNewCategoryMenu} style={{ backgroundColor: 'white' }}>
                                    <Typography>New Category</Typography>
                                </MenuItem>
                                <Popper placement={'right'} anchorEl={subAnchorEl} open={subOpen}>
                                    <ClickAwayListener onClickAway={closeNewCategoryMenu}>
                                        <div style={{ backgroundColor: 'white' }}>
                                            <NewCategoryInput
                                                cardCategories={[]}
                                                deckCategories={[]}
                                                onSubmit={(
                                                    type: string,
                                                    extra: string,
                                                    comment: string,
                                                    colors: Color[],
                                                    categoryType: 'CARD' | 'DECK',
                                                ) => {
                                                    console.log('Submit', type, extra, comment, colors, categoryType)
                                                    closeNewCategoryMenu()
                                                }}
                                            />
                                        </div>
                                    </ClickAwayListener>
                                </Popper>
                            </div>
                        </ClickAwayListener>
                    </Popper>
                    <CatalogueFilter
                        filter={filter}
                        setFilter={setFilter}
                        clearFilter={() => setFilter(cloneDeep(initialCatalogueState.filter))}
                    />
                </Box>
                <Box flex={1} display={'flex'} alignItems={'center'}>
                    <FormControl fullWidth>
                        <InputLabel>Expansion</InputLabel>
                        <Select color={'secondary'} label={'Expansion'}>
                            <Box>
                                {Object.entries(filter.expansions).map(([key, value]) => {
                                    return (
                                        <Box
                                            key={key}
                                            onContextMenu={(e) => {
                                                e.preventDefault()
                                                const newFilter = cloneDeep(filter)
                                                newFilter.expansions[key as Set] = TernaryBoolean.UNSET
                                                setFilter(newFilter)
                                            }}
                                        >
                                            <TernaryToggle
                                                type={'checkbox'}
                                                value={value}
                                                labelProps={{
                                                    label: (
                                                        <Box display={'flex'} columnGap={2}>
                                                            <img
                                                                src={`/img/sets/${key}.svg`}
                                                                onError={({ currentTarget }) => {
                                                                    currentTarget.style.display = 'none'
                                                                }}
                                                                alt={''}
                                                                width={20}
                                                                loading={'lazy'}
                                                            />
                                                            <Typography>{key}</Typography>
                                                        </Box>
                                                    ),
                                                    labelPlacement: 'end',
                                                }}
                                                checkboxProps={{
                                                    onChange: () => {
                                                        const newFilter = cloneDeep(filter)
                                                        newFilter.expansions[key as Set] = nextTB(
                                                            newFilter.expansions[key as Set],
                                                        )
                                                        setFilter(newFilter)
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )
                                })}
                            </Box>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            color={'secondary'}
                            label="Sort By"
                            value={sortBy}
                            onChange={(e) => {
                                changeSortBy(e.target.value as SortEnum)
                            }}
                        >
                            {Object.entries(SortEnum).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Sort Direction</InputLabel>
                        <Select
                            color={'secondary'}
                            label={'Sort Direction'}
                            value={sortDirection}
                            onChange={(e) => {
                                changeSortDirection(e.target.value as SortDirection)
                            }}
                        >
                            {Object.entries(SortDirection).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {key}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box display={'flex'} flex={1}>
                {/* IZQ */}
                <Box flex={4} display={'flex'} flexDirection={'column'}>
                    {/* CARTAS */}
                    <Box flex={5} display={'flex'} maxHeight={'100%'} overflow={'hidden'}>
                        {/* BACK */}
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                            <Box>
                                <IconButton disabled={page === 0} onClick={prevPage}>
                                    <NavigateBefore />
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton disabled={page === 0} onClick={firstPage}>
                                    <NavigateBefore />
                                </IconButton>
                            </Box>
                        </Box>
                        {/* CARTAS */}
                        <Box
                            onWheel={(e) => {
                                if (e.deltaY > 0 && !((page + 1) * PAGE_SIZE >= allCards.length)) {
                                    nextPage()
                                }
                                if (e.deltaY < 0 && !(page === 0)) {
                                    prevPage()
                                }
                            }}
                            id={'CardContainer'}
                            flex={1}
                            // columnGap={`${columnGap}px`}
                            // rowGap={`${rowGap}px`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {cardsToShow.map((chunk, i) => {
                                return (
                                    <Box key={i + '_' + chunk.length} display={'flex'}>
                                        {chunk.map((card) => (
                                            <Box
                                                key={card.id}
                                                // width={`${CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].width * scale}px`}
                                                // height={`${CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].height * scale}px`}
                                            >
                                                <CardWithHover
                                                    // selected={selectedCard && selectedCard.id === card.id}
                                                    // onClick={() => {
                                                    //    setSelectedCardID(card.id)
                                                    // }}
                                                    // onContextMenu={(e) => {
                                                    //     e.preventDefault()
                                                    //     setSelectedCardID(card.id)
                                                    // }}
                                                    card={card}
                                                    // scale={scale}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                )
                            })}
                        </Box>
                        {/* NEXT */}
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                            <Box>
                                <IconButton disabled={disableNext} onClick={nextPage}>
                                    <NavigateNext />
                                </IconButton>
                            </Box>
                            <Box>
                                <IconButton disabled={disableNext} onClick={lastPage}>
                                    <NavigateNext />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Catalogue
