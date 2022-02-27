import { Box } from '@mui/system'
import React from 'react'
import { useCatalogueDatabaseState } from 'pages/Catalogue/useCatalogueDatabaseState'
import CatalogueModal from 'components/CatalogueModal'
import CatalogueFilter from 'pages/Catalogue/components/CatalogueFilter'
import { IconButton } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos, ZoomIn, ZoomOut } from '@mui/icons-material'
import CardWithHover from 'components/CardWithHover'
import CategoryPill from 'components/CategoryPill'
import AddCategory from 'components/AddCategory'
import { sortBy } from 'lodash'
import { CARD_SIZE_VALUES } from 'utils/constants'
import { CARD_IMAGE_SIZE } from 'utils/types'
import CatalogueFilterModal from 'pages/Catalogue/components/CatalogueFilterModal'
import { initialCatalogueState } from 'store/CatalogueState/CatalogueState.reducer'
import { filterCards } from 'utils/funcs'

const Catalogue = (): JSX.Element => {
    const {
        addCategoryToCard,
        addCategoryToDB,
        cardsPerPage,
        categories,
        columnGap,
        currPage,
        done,
        filter,
        mtgaCards,
        removeCategoryFromCard,
        removeCategoryFromDB,
        rowGap,
        scale,
        selectedCard,
        setCurrPage,
        setFilter,
        setSelectedCardID,
        setZoomLevel,
        cardsToShow,
        setCardsToShow,
        toggleCategoryFilter,
        zoom,
    } = useCatalogueDatabaseState()

    const [isFilterOpen, setIsFilterOpen] = React.useState(false)

    if (!done) {
        return <div>Loading...</div>
    }

    return (
        <Box width={'100vw'} height={'100vh'} maxHeight={'100vh'} overflow={'hidden'} bgcolor={'pink'} display={'flex'}>
            {/* IZQ */}
            <Box flex={4} display={'flex'} flexDirection={'column'}>
                {/* TOP */}
                <Box flex={1} display={'flex'}>
                    {/* FILTROS */}
                    <Box flex={1}>
                        <CatalogueFilter
                            filter={filter}
                            onOpenClick={() => {
                                setIsFilterOpen(true)
                            }}
                            setFilter={setFilter}
                            clearFilter={() => setFilter({ ...initialCatalogueState.filter })}
                        />
                    </Box>
                    {/* CONTROLES */}
                    <Box flex={1}>
                        <Box display={'flex'} flexDirection={'column'} rowGap={'8px'} padding={2}>
                            <Box display={'flex'} columnGap={'4px'}>
                                <IconButton size={'small'} onClick={() => setZoomLevel(zoom === 'IN' ? 'OUT' : 'IN')}>
                                    {zoom === 'IN' ? (
                                        <ZoomOut style={{ width: 40, height: 40 }} />
                                    ) : (
                                        <ZoomIn style={{ width: 40, height: 40 }} />
                                    )}
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {/* CARTAS */}
                <Box flex={5} display={'flex'} maxHeight={'100%'} overflow={'hidden'}>
                    {/* BACK */}
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Box>
                            <IconButton disabled={currPage === 0} onClick={() => setCurrPage(currPage - 1)}>
                                <ArrowBackIos />
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton disabled={currPage === 0} onClick={() => setCurrPage(0)}>
                                <ArrowBackIos />
                            </IconButton>
                        </Box>
                    </Box>
                    {/* CARTAS */}
                    <Box
                        onWheel={(e) => {
                            if (e.deltaY > 0 && !((currPage + 1) * cardsPerPage >= cardsToShow.length)) {
                                setCurrPage(currPage + 1)
                            }
                            if (e.deltaY < 0 && !(currPage === 0)) {
                                setCurrPage(currPage - 1)
                            }
                        }}
                        id={'CardContainer'}
                        flex={1}
                        display={'flex'}
                        flexWrap={'wrap'}
                        columnGap={`${columnGap}px`}
                        rowGap={`${rowGap}px`}
                        alignContent={'flex-start'}
                    >
                        {cardsToShow.slice(currPage * cardsPerPage, (currPage + 1) * cardsPerPage).map((card) => {
                            return (
                                <Box
                                    key={card.id}
                                    width={`${CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].width * scale}px`}
                                    height={`${CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].height * scale}px`}
                                >
                                    <CardWithHover
                                        selected={selectedCard && selectedCard.id === card.id}
                                        onClick={() => {
                                            setSelectedCardID(card.id)
                                        }}
                                        // onContextMenu={(e) => {
                                        //     e.preventDefault()
                                        //     setSelectedCardID(card.id)
                                        // }}
                                        card={card}
                                        scale={scale}
                                    />
                                </Box>
                            )
                        })}
                    </Box>
                    {/* NEXT */}
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Box>
                            <IconButton
                                disabled={(currPage + 1) * cardsPerPage >= cardsToShow.length}
                                onClick={() => setCurrPage(currPage + 1)}
                            >
                                <ArrowForwardIos />
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton
                                disabled={(currPage + 1) * cardsPerPage >= cardsToShow.length}
                                onClick={() => setCurrPage(Math.floor(cardsToShow.length / cardsPerPage) - 1)}
                            >
                                <ArrowForwardIos />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/* DER */}
            <Box flex={1} display={'flex'} flexDirection={'column'}>
                {/* CAT ARRAY */}
                <Box
                    flex={6}
                    display={'flex'}
                    flexDirection={'column'}
                    rowGap={'10px'}
                    padding={'20px 30px'}
                    style={{ overflowY: 'scroll' }}
                >
                    {sortBy(categories, ['name', 'colors.length']).map((c) => {
                        return (
                            <CategoryPill
                                category={c}
                                key={c.id}
                                onClick={() => toggleCategoryFilter(c.id)}
                                selected={filter.categories.includes(c.id)}
                                onDeleteClick={() => removeCategoryFromDB(c)}
                            />
                        )
                    })}
                </Box>
                {/* ADD CAT */}
                <Box flex={1} paddingBottom={4}>
                    <AddCategory categories={categories} onAdd={addCategoryToDB} />
                </Box>
            </Box>
            {selectedCard && (
                <CatalogueModal
                    onClose={() => setSelectedCardID(undefined)}
                    selectedCard={selectedCard}
                    addCategoryToDB={addCategoryToDB}
                    removeCategoryFromDB={removeCategoryFromDB}
                    categories={categories}
                    removeCategoryFromCard={removeCategoryFromCard}
                    addCategoryToCard={addCategoryToCard}
                />
            )}
            <CatalogueFilterModal
                visible={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentFilter={filter}
                onConfirm={(filter) => {
                    setFilter(filter)
                    setIsFilterOpen(false)
                    setCardsToShow(filterCards(mtgaCards, filter))
                }}
                cards={mtgaCards}
            />
        </Box>
    )
}

export default Catalogue
