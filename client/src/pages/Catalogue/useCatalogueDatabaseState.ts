import { groupBy, sortBy } from 'lodash'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CatalogueStateActions, { CatalogueStateAction } from 'store/CatalogueState/CatalogueState.actions'
import { CatalogueFilterType } from 'store/CatalogueState/CatalogueState.reducer'
import { AppState } from 'store/store'
import { CARD_SIZE_VALUES } from 'utils/constants'
import { createObjectStore, deleteValue, getAllValue, putBulkValue, putValue } from 'utils/database'
import { fetchCards, filterCards } from 'utils/funcs'
import { CardCategory, CARD_IMAGE_SIZE, MTGACard } from 'utils/types'

export interface useCatalogueDatabaseStateReturn {
    addCategoryToCard: (category: CardCategory) => void
    addCategoryToDB: (category: CardCategory) => void
    cardsPerPage: number
    cardsToShow: MTGACard[]
    categories: CardCategory[]
    columnGap: number
    currPage: number
    done: boolean
    filter: CatalogueFilterType
    mtgaCards: MTGACard[]
    removeCategoryFromCard: (category: CardCategory) => void
    removeCategoryFromDB: (category: CardCategory) => void
    rowGap: number
    scale: number
    selectedCard: MTGACard | undefined
    selectedCardID: string | undefined
    setCardsToShow: Dispatch<SetStateAction<MTGACard[]>>
    setCurrPage: Dispatch<SetStateAction<number>>
    setFilter: (payload: Partial<CatalogueFilterType>) => void
    setSelectedCardID: Dispatch<SetStateAction<string | undefined>>
    setZoomLevel: (payload: 'IN' | 'OUT') => void
    toggleCategoryFilter: (id: string) => void
    zoom: 'IN' | 'OUT'
}

export const useCatalogueDatabaseState = (): useCatalogueDatabaseStateReturn => {
    const mtgaCreaturesQuery = 'https://api.scryfall.com/cards/search?q=game%3Aarena'
    // const mtgaCreaturesQuery = 'https://api.scryfall.com/cards/search?q=game%3Aarena+and+unique%3Aprints'
    const [mtgaCards, setMtgaCards] = useState<MTGACard[]>([])
    const [cardsToShow, setCardsToShow] = useState<MTGACard[]>([])
    const [selectedCardID, setSelectedCardID] = useState<string | undefined>(undefined)
    const [categories, setCategories] = useState<CardCategory[]>([])
    const [done, setDone] = useState<boolean>(false)
    const [currPage, setCurrPage] = useState<number>(0)
    const [cardsPerPage, setCardsPerPage] = useState(0)
    const [columnGap, setColumnGap] = useState(0)
    const [rowGap, setRowGap] = useState(0)

    const {
        catalogueState: { filter, zoom },
    } = useSelector((appState: AppState) => ({
        catalogueState: appState.catalogueState,
    }))
    const dispatch = useDispatch<Dispatch<CatalogueStateActions>>()
    const setFilter = useCallback(
        (payload: Partial<CatalogueFilterType>) => {
            dispatch({ type: CatalogueStateAction.SET_FILTER, payload })
        },
        [dispatch],
    )
    const setZoomLevel = useCallback(
        (payload: 'IN' | 'OUT') => {
            dispatch({ type: CatalogueStateAction.SET_ZOOM_LEVEL, payload })
        },
        [dispatch],
    )
    const scale = zoom === 'IN' ? 1 : 0.6

    useEffect(() => {
        setCardsToShow(filterCards(mtgaCards, filter))
    }, [mtgaCards, filter])

    useEffect(() => {
        if (done) {
            const checkNumCardsFit = () => {
                const element = document.getElementById('CardContainer')
                if (element) {
                    const { width: boxWidth, height: boxHeight } = element.getBoundingClientRect()
                    const { height, width } = CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL]
                    const imagesFitWidth = Math.floor(boxWidth / (width * scale))
                    const remainingColumnSpace = boxWidth - imagesFitWidth * (width * scale)
                    const columnGap = remainingColumnSpace / imagesFitWidth
                    setColumnGap(columnGap)
                    const imagesFitHeight = Math.floor(boxHeight / (height * scale))
                    const remainingRowSpace = boxHeight - imagesFitHeight * (height * scale)
                    const rowGap = remainingRowSpace / imagesFitHeight
                    setRowGap(rowGap)
                    const newCardsPerPage = imagesFitHeight * imagesFitWidth
                    if (newCardsPerPage > cardsPerPage) {
                        const newNumPages = Math.floor(mtgaCards.length / newCardsPerPage)
                        if (currPage > newNumPages) {
                            setCurrPage(newNumPages - 1)
                        }
                    }
                    setCardsPerPage(newCardsPerPage)
                }
            }
            checkNumCardsFit()
            window.addEventListener('resize', checkNumCardsFit)
            return () => window.removeEventListener('resize', checkNumCardsFit)
        }
    }, [done, currPage, cardsPerPage, scale, cardsToShow])

    useEffect(() => {
        const runIndexDb = async () => {
            await createObjectStore(['cards', 'categories'])
            const cards = await getAllValue('cards')
            const categories = await getAllValue('categories')
            if (categories.length > 0) {
                setCategories(categories)
            }
            if (cards.length > 0) {
                const copyCards: MTGACard[] = [...cards]
                console.log(
                    copyCards.filter((c) => c.variation),
                    // .map((c) => ({ a0: c.rulings_uri, a: c.name, b: c.scryfall_uri, c: c.set_name, d: c.id })),
                    // .map((c) => ({ a0: c.oracle_text, a1: c.layout, a: c.name, b: c.scryfall_uri, c: c.set_name })),
                    // .map((c) => c.set_uri),
                )
                // console.log(
                //     copyCards
                //         .reduce((acc, curr) => {
                //             for (const keyword of curr.keywords) {
                //                 if (!acc.includes(keyword)) {
                //                     acc.push(keyword)
                //                 }
                //             }
                //             return acc
                //         }, [] as string[])
                //         .sort(),
                // )
                const artistGroups = groupBy(
                    copyCards.map((c) => ({ artist: c.artist, images: c.image_uris, card_faces: c.card_faces })),
                    'artist',
                )
                let max: { name: string; value: number } = { name: '', value: 0 }
                for (const artist in artistGroups) {
                    if (artist.length > 0 && artist !== 'Svetlin Velinov' && artistGroups[artist].length > max.value) {
                        max = { name: artist, value: artistGroups[artist].length }
                    }
                }
                console.log('NAME', max.name, artistGroups[max.name])
                setMtgaCards(sortBy(cards, ['color_identity.length', 'color_identity', 'cmc', 'name']))
                setDone(true)
            } else {
                fetchCards(mtgaCreaturesQuery, setMtgaCards, setDone)
            }
        }
        runIndexDb()
    }, [])

    useEffect(() => {
        const saveCardsToDB = async (done: boolean) => {
            if (done) {
                const cards = await getAllValue('cards')
                if (!cards || cards.length === 0) {
                    const cardsMap: { [key: string]: any }[] = []
                    for (const card of mtgaCards) {
                        const cardMap: { [key: string]: any } = {}
                        const map = Object.entries(card)
                        for (const [key, value] of map) {
                            if (key === 'color_identity' && value.length === 0) {
                                cardMap[key] = ['C']
                            } else {
                                cardMap[key] = value
                            }
                        }
                        cardsMap.push(cardMap)
                    }
                    putBulkValue('cards', cardsMap)
                } else {
                    // UPDATE CARD
                    const cardMap: { [key: string]: any } = {}
                    if (selectedCardID) {
                        const card = mtgaCards.find((c) => c.id === selectedCardID)
                        if (card) {
                            const map = Object.entries(card)
                            for (const [key, value] of map) {
                                if (key === 'color_identity' && value.length === 0) {
                                    cardMap[key] = ['C']
                                } else {
                                    cardMap[key] = value
                                }
                            }
                            putValue('cards', cardMap)
                        }
                    }
                }
            }
        }
        saveCardsToDB(done)
    }, [done, mtgaCards])

    const addCategoryToDB = async (category: CardCategory) => {
        const categoryMap: { [key: string]: any } = {}
        const map = Object.entries(category)
        for (const [key, value] of map) {
            categoryMap[key] = value
        }
        putValue('categories', categoryMap)
        setCategories((categories) => [...categories, category])
        setMtgaCards((mtgaCards) => {
            const card = mtgaCards.find((card) => card.id === selectedCardID)
            if (card) {
                card.categories = [...card.categories, category.id]
            }
            return [...mtgaCards]
        })
    }

    const removeCategoryFromDB = async (category: CardCategory) => {
        deleteValue('categories', category.id)
        setCategories((categories) => categories.filter((c) => c.id !== category.id))
        const newCards = [...mtgaCards].map((c) => ({
            ...c,
            categories: [...c.categories.filter((cat) => cat !== category.id)],
        }))
        const cardsMap: { [key: string]: any }[] = []
        for (const card of newCards) {
            const cardMap: { [key: string]: any } = {}
            const map = Object.entries(card)
            for (const [key, value] of map) {
                cardMap[key] = value
            }
            cardsMap.push(cardMap)
        }
        putBulkValue('cards', cardsMap)
    }

    const removeCategoryFromCard = (category: CardCategory) => {
        setMtgaCards((mtgaCards) => {
            const card = mtgaCards.find((card) => card.id === selectedCardID)
            if (card) {
                card.categories = card.categories.filter((c) => c !== category.id)
            }
            return [...mtgaCards]
        })
    }

    const addCategoryToCard = (category: CardCategory) => {
        setMtgaCards((mtgaCards) => {
            const card = mtgaCards.find((card) => card.id === selectedCardID)
            if (card) {
                card.categories = [...card.categories, category.id]
            }
            return [...mtgaCards]
        })
    }

    const selectedCard = useMemo(() => {
        return mtgaCards.find((c) => c.id === selectedCardID)
    }, [mtgaCards, selectedCardID])

    const toggleCategoryFilter = (id: string) => {
        const newFilter = { ...filter }
        const idIndex = newFilter.categories.findIndex((c) => c === id)
        if (idIndex === -1) {
            newFilter.categories.push(id)
        } else {
            newFilter.categories.splice(idIndex, 1)
        }
        setFilter(newFilter)
    }

    // const filterCards = (cards: MTGACard[], filter: CatalogueFilterType): MTGACard[] => {
    //     const toReturn: MTGACard[] = []

    //     for (const card of cards) {
    //         if (filter.categories.length === 0 || filter.categories.some((cat) => card.categories.includes(cat))) {
    //             toReturn.push(card)
    //         }
    //     }

    //     return toReturn
    // }

    return {
        addCategoryToCard,
        addCategoryToDB,
        cardsPerPage,
        categories,
        columnGap,
        currPage,
        done,
        filter,
        mtgaCards: filterCards(mtgaCards, filter),
        removeCategoryFromCard,
        removeCategoryFromDB,
        rowGap,
        scale,
        selectedCard,
        selectedCardID,
        setCurrPage,
        setFilter,
        setSelectedCardID,
        setZoomLevel,
        toggleCategoryFilter,
        zoom,
        cardsToShow,
        setCardsToShow,
    }
}
