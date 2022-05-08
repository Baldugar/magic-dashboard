import { ExpandMore, NavigateBefore, NavigateNext } from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ButtonBase,
    ClickAwayListener,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Popper,
    Select,
    Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import CardWithHover from 'components/CardWithHover'
import { cloneDeep } from 'lodash'
import CatalogueFilter from 'pages/Catalogue/components/CatalogueFilter'
import { useCatalogueState } from 'pages/Catalogue/useCatalogueState'
import { MouseEvent, useState } from 'react'
import { initialCatalogueState, SortDirection, SortEnum } from 'store/CatalogueState/CatalogueState.reducer'
import { isNegativeTB, isNotUnsetTB, isPositiveTB, nextTB, prevTB, TernaryBoolean } from 'utils/ternaryBoolean'
import { CategoryType, Color, Set } from 'graphql/types'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import { NewCategoryInput } from 'pages/Catalogue/components/NewCategoryInput/NewCategoryInput'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CardModal from 'pages/Catalogue/components/CardModal'

const Catalogue = (): JSX.Element => {
    const [search] = useSearchParams()
    const userID = search.get('userID') || ''
    const navigate = useNavigate()

    if (userID === '') {
        navigate('/login', { replace: true })
    }

    console.log('USER ID', userID)
    const {
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
        cardTags,
        deckTags,
        handleAddTag,
        handleOnTagClick,
        handleOnTagContextMenu,
        openCardModal,
        selectedCard,
        setSelectedCard,
        handleAddTagLink,
        handleUpdateUserCardMeta,
        handleUpdateTagLink,
        handleRemoveTagLink,
    } = useCatalogueState(userID)

    const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState<Element | null>(null)
    const [newCategoryAnchorEl, setNewCategoryAnchorEl] = useState<Element | null>(null)

    const categoryMenuOpen = Boolean(categoryMenuAnchorEl)
    const newCategoryMenuOpen = Boolean(newCategoryAnchorEl)
    const openCategoryMenu = (e: MouseEvent<HTMLButtonElement>) => setCategoryMenuAnchorEl(e.currentTarget)
    const openNewCategoryMenu = (e: MouseEvent<HTMLLIElement>) => {
        if (newCategoryMenuOpen) {
            setNewCategoryAnchorEl(null)
        } else {
            setNewCategoryAnchorEl(e.currentTarget)
        }
    }
    const closeCategoryMenu = () => {
        setCategoryMenuAnchorEl(null)
        setNewCategoryAnchorEl(null)
    }
    const closeNewCategoryMenu = () => setNewCategoryAnchorEl(null)

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
                    <Button
                        onClick={openCategoryMenu}
                        variant={'contained'}
                        color={
                            Object.values(filter.categories).filter((c) => isNotUnsetTB(c)).length > 0 ||
                            isNotUnsetTB(filter.cardsWithoutCategory)
                                ? 'secondary'
                                : 'primary'
                        }
                    >
                        Categories
                    </Button>
                    <Popper anchorEl={categoryMenuAnchorEl} open={categoryMenuOpen}>
                        <ClickAwayListener onClickAway={closeCategoryMenu}>
                            <div style={{ overflow: 'auto', maxHeight: '90vh', width: '400px' }}>
                                <MenuItem onClick={openNewCategoryMenu} style={{ backgroundColor: 'white' }}>
                                    <Typography>New Category</Typography>
                                </MenuItem>
                                <MenuItem
                                    style={{ backgroundColor: 'white' }}
                                    onContextMenu={() => {
                                        const newFilter = cloneDeep(filter)
                                        newFilter.cardsWithoutCategory = prevTB(newFilter.cardsWithoutCategory)
                                        setFilter(newFilter)
                                    }}
                                >
                                    <TernaryToggle
                                        type={'checkbox'}
                                        value={filter.cardsWithoutCategory}
                                        checkboxProps={{
                                            checked: isPositiveTB(filter.cardsWithoutCategory),
                                            indeterminate: isNegativeTB(filter.cardsWithoutCategory),
                                            onChange: () => {
                                                const newFilter = cloneDeep(filter)
                                                newFilter.cardsWithoutCategory = nextTB(newFilter.cardsWithoutCategory)
                                                setFilter(newFilter)
                                            },
                                        }}
                                        labelProps={{
                                            label: 'Cards without category',
                                        }}
                                    />
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        const newFilter = { ...filter }
                                        newFilter.cardsWithoutCategory = 0
                                        const keys = Object.keys(newFilter.categories)
                                        for (const key of keys) {
                                            newFilter.categories[key] = 0
                                        }
                                        setFilter(newFilter)
                                    }}
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <Typography>Clear Selected Categories</Typography>
                                </MenuItem>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <MenuItem style={{ backgroundColor: 'white' }}>
                                            <Typography>Card Categories</Typography>
                                        </MenuItem>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {cardTags.length === 0 ? (
                                            <Box>
                                                <Typography>No Card Categories</Typography>
                                            </Box>
                                        ) : (
                                            cardTags.map((tag) => (
                                                <Box key={tag.id} style={{ backgroundColor: 'white' }}>
                                                    <TernaryToggle
                                                        type={'chip'}
                                                        chipProps={{
                                                            category: tag,
                                                            onClick: () => {
                                                                handleOnTagClick(tag)
                                                            },
                                                            onContextMenu: () => {
                                                                handleOnTagContextMenu(tag)
                                                            },
                                                        }}
                                                        value={filter.categories[tag.id]}
                                                    />
                                                </Box>
                                            ))
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <MenuItem style={{ backgroundColor: 'white' }}>
                                            <Typography>Deck Categories</Typography>
                                        </MenuItem>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {deckTags.length === 0 ? (
                                            <Box>
                                                <Typography>No Deck Categories</Typography>
                                            </Box>
                                        ) : (
                                            deckTags.map((tag) => (
                                                <Box key={tag.id} style={{ backgroundColor: 'white' }}>
                                                    <TernaryToggle
                                                        type={'chip'}
                                                        chipProps={{
                                                            category: tag,
                                                            onClick: () => {
                                                                handleOnTagClick(tag)
                                                            },
                                                            onContextMenu: () => {
                                                                handleOnTagContextMenu(tag)
                                                            },
                                                        }}
                                                        value={filter.categories[tag.id]}
                                                    />
                                                </Box>
                                            ))
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                                <Popper placement={'right'} anchorEl={newCategoryAnchorEl} open={newCategoryMenuOpen}>
                                    <ClickAwayListener onClickAway={closeNewCategoryMenu}>
                                        <div style={{ backgroundColor: 'white' }}>
                                            <NewCategoryInput
                                                cardCategories={cardTags}
                                                deckCategories={deckTags}
                                                onSubmit={(
                                                    type: string,
                                                    extra: string,
                                                    colors: Color[],
                                                    categoryType: CategoryType,
                                                ) => {
                                                    handleAddTag({
                                                        categoryType,
                                                        colors,
                                                        extra,
                                                        name: type,
                                                    })
                                                    console.log('Submit', type, extra, colors, categoryType)
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
                                if (selectedCard === null) {
                                    if (e.deltaY > 0 && !disableNext) {
                                        nextPage()
                                    }
                                    if (e.deltaY < 0 && !(page === 0)) {
                                        prevPage()
                                    }
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
                                                key={card.card.id}
                                                // width={`${CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].width * scale}px`}
                                                // height={`${CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].height * scale}px`}
                                            >
                                                <CardWithHover
                                                    selected={
                                                        selectedCard !== null && selectedCard.card.id === card.card.id
                                                    }
                                                    onClick={() => {
                                                        setSelectedCard(card)
                                                    }}
                                                    // onContextMenu={(e) => {
                                                    //     e.preventDefault()
                                                    //     setSelectedCardID(card.id)
                                                    // }}
                                                    card={card.card}
                                                    // scale={scale}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                )
                            })}
                            <Modal
                                open={openCardModal}
                                onClose={() => {
                                    setSelectedCard(null)
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    columnGap: '16px',
                                }}
                            >
                                <>
                                    {selectedCard && (
                                        <ButtonBase
                                            TouchRippleProps={{
                                                style: {
                                                    borderRadius: '30px',
                                                },
                                            }}
                                            onClick={
                                                cardsToShow
                                                    .flat()
                                                    .findIndex(
                                                        (c) => selectedCard && c.card.id === selectedCard.card.id,
                                                    ) === 0
                                                    ? undefined
                                                    : () =>
                                                          setSelectedCard(
                                                              cardsToShow.flat()[
                                                                  cardsToShow
                                                                      .flat()
                                                                      .findIndex(
                                                                          (c) =>
                                                                              selectedCard &&
                                                                              c.card.id === selectedCard.card.id,
                                                                      ) - 1
                                                              ],
                                                          )
                                            }
                                        >
                                            <Box
                                                width={60}
                                                height={60}
                                                borderRadius={'30px'}
                                                display={'flex'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                bgcolor={'white'}
                                                border={'1px solid black'}
                                            >
                                                <NavigateBefore />
                                            </Box>
                                        </ButtonBase>
                                    )}
                                    <CardModal
                                        onTagRemove={(tag) => {
                                            if (selectedCard) {
                                                handleRemoveTagLink({
                                                    cardID: selectedCard.card.id,
                                                    tagID: tag.id,
                                                    categoryType: tag.categoryType,
                                                    userID,
                                                })
                                            }
                                        }}
                                        onTagUpdate={(tag, rating, comment) => {
                                            if (selectedCard) {
                                                handleUpdateTagLink({
                                                    cardID: selectedCard.card.id,
                                                    categoryType: tag.categoryType,
                                                    tagID: tag.id,
                                                    rating,
                                                    comment,
                                                    userID,
                                                })
                                            }
                                        }}
                                        onMetaUpdate={(rating, comment) => {
                                            if (selectedCard) {
                                                handleUpdateUserCardMeta({
                                                    cardID: selectedCard.card.id,
                                                    rating,
                                                    comment,
                                                    userID,
                                                })
                                            }
                                        }}
                                        onTagAddToCard={(tag, rating, comment) => {
                                            if (selectedCard) {
                                                handleAddTagLink({
                                                    cardID: selectedCard.card.id,
                                                    categoryType: tag.categoryType,
                                                    comment,
                                                    rating,
                                                    tagID: tag.id,
                                                    userID,
                                                })
                                            }
                                        }}
                                        cardTags={cardTags}
                                        deckTags={deckTags}
                                        onNewCategoryAdd={(
                                            type: string,
                                            extra: string,
                                            colors: Color[],
                                            categoryType: CategoryType,
                                        ) => {
                                            handleAddTag({
                                                categoryType,
                                                colors,
                                                extra,
                                                name: type,
                                            })
                                        }}
                                        userCard={selectedCard}
                                    />
                                    {selectedCard && (
                                        <ButtonBase
                                            TouchRippleProps={{
                                                style: {
                                                    borderRadius: '30px',
                                                },
                                            }}
                                            onClick={() =>
                                                cardsToShow
                                                    .flat()
                                                    .findIndex(
                                                        (c) => selectedCard && c.card.id === selectedCard.card.id,
                                                    ) ===
                                                cardsToShow.flat().length - 1
                                                    ? undefined
                                                    : setSelectedCard(
                                                          cardsToShow.flat()[
                                                              cardsToShow
                                                                  .flat()
                                                                  .findIndex(
                                                                      (c) =>
                                                                          selectedCard &&
                                                                          c.card.id === selectedCard.card.id,
                                                                  ) + 1
                                                          ],
                                                      )
                                            }
                                        >
                                            <Box
                                                width={60}
                                                height={60}
                                                borderRadius={'30px'}
                                                display={'flex'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                bgcolor={'white'}
                                                border={'1px solid black'}
                                            >
                                                <NavigateNext />
                                            </Box>
                                        </ButtonBase>
                                    )}
                                </>
                            </Modal>
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
