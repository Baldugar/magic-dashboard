import { Box } from '@mui/system'
import CardWithHover from 'components/CardWithHover'
import { useCatalogueDatabaseState } from 'pages/Catalogue/useCatalogueDatabaseState'

const Catalogue = (): JSX.Element => {
    const { done, cardsToShow } = useCatalogueDatabaseState()

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
                    <Box flex={1}></Box>
                    {/* CONTROLES */}
                    <Box flex={1}>
                        <Box display={'flex'} flexDirection={'column'} rowGap={'8px'} padding={2}>
                            <Box display={'flex'} columnGap={'4px'}></Box>
                        </Box>
                    </Box>
                </Box>
                {/* CARTAS */}
                <Box flex={5} display={'flex'} maxHeight={'100%'} overflow={'hidden'}>
                    {/* BACK */}
                    {/* <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
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
                    </Box> */}
                    {/* CARTAS */}
                    <Box
                        // onWheel={(e) => {
                        //     if (e.deltaY > 0 && !((currPage + 1) * cardsPerPage >= cardsToShow.length)) {
                        //         setCurrPage(currPage + 1)
                        //     }
                        //     if (e.deltaY < 0 && !(currPage === 0)) {
                        //         setCurrPage(currPage - 1)
                        //     }
                        // }}
                        id={'CardContainer'}
                        flex={1}
                        display={'flex'}
                        flexWrap={'wrap'}
                        // columnGap={`${columnGap}px`}
                        // rowGap={`${rowGap}px`}
                        alignContent={'flex-start'}
                    >
                        {cardsToShow
                            // .slice(currPage * cardsPerPage, (currPage + 1) * cardsPerPage)
                            .map((userCard) => {
                                return (
                                    <Box
                                        key={userCard.card.id}
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
                                            card={userCard.card}
                                            // scale={scale}
                                        />
                                    </Box>
                                )
                            })}
                    </Box>
                    {/* NEXT */}
                    {/* <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
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
                    </Box> */}
                </Box>
            </Box>
        </Box>
    )
}

export default Catalogue
