import { useLazyQuery } from '@apollo/client'
import getCards from 'graphql/getCards'
import { MTGACard, MTGACard_User, Query } from 'graphql/types'
import { chunk } from 'lodash'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { CatalogueStateAction } from 'store/CatalogueState/CatalogueState.actions'
import {
    CatalogueFilterType,
    initialCatalogueState,
    SortDirection,
    SortEnum,
} from 'store/CatalogueState/CatalogueState.reducer'
import { AppState } from 'store/store'
import { CARD_IMAGE_SIZE, CARD_SIZE_VALUES } from 'utils/constants'
import { filterCards } from 'utils/funcs'

export interface useCatalogueDatabaseStateReturn {
    allCards: MTGACard[]
    cardsToShow: MTGACard[][]
    done: boolean
    page: number
    nextPage: () => void
    prevPage: () => void
    firstPage: () => void
    lastPage: () => void
    disableNext: boolean
    setFilter: (payload: Partial<CatalogueFilterType>) => void
    filter: CatalogueFilterType
    setIsFilterOpen: Dispatch<SetStateAction<boolean>>
    sortBy: SortEnum
    sortDirection: SortDirection
    changeSortBy: (sortBy: SortEnum) => void
    changeSortDirection: (sortDirection: SortDirection) => void
}

export const useCatalogueDatabaseState = (): useCatalogueDatabaseStateReturn => {
    const [allCards, setAllCards] = useState<MTGACard[]>([])
    const [filteredCards, setFilteredCards] = useState<MTGACard[]>([])
    const [userCards, setUserCards] = useState<MTGACard_User[]>([])
    const [done, setDone] = useState<boolean>(true)
    const [page, setPage] = useState(0)
    const [cardsPerRow, setCardsPerRow] = useState(
        Math.floor((document.body.clientWidth - 100) / CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].width),
    )
    const [rowsPerPage, setRowsPerPage] = useState(
        Math.floor((document.body.clientHeight - 50) / CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].height),
    )

    const [pageSize, setPageSize] = useState(cardsPerRow * rowsPerPage)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const {
        catalogueState: {
            filter,
            sort: { sortBy, sortDirection },
        },
    } = useSelector((appState: AppState) => ({
        catalogueState: appState.catalogueState,
    }))
    const dispatch = useDispatch()
    const setFilter = useCallback(
        (payload: Partial<CatalogueFilterType>) => {
            dispatch({ type: CatalogueStateAction.SET_FILTER, payload })
        },
        [dispatch],
    )
    const setSort = useCallback(
        (payload: Partial<{ sortBy: SortEnum; sortDirection: SortDirection }>) => {
            dispatch({ type: CatalogueStateAction.SET_SORT, payload })
        },
        [dispatch],
    )

    const [getCardsQuery] = useLazyQuery<Query, { data: MTGACard[] }>(getCards, {
        onCompleted: (data) => {
            if (data.getCards) {
                setAllCards(data.getCards)
                setFilteredCards(data.getCards)
                setDone(true)
            }
        },
    })

    useEffect(() => {
        // setDone(false)
        getCardsQuery()
    }, [])

    useEffect(() => {
        const onResize = () => {
            const cardsPerRow = Math.floor(
                (document.body.clientWidth - 100) / CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].width,
            )
            setCardsPerRow(cardsPerRow)
            const rowsPerPage = Math.floor(
                (document.body.clientHeight - 50) / CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].height,
            )
            setRowsPerPage(rowsPerPage)
            setPageSize(cardsPerRow * rowsPerPage)
        }
        onResize()
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [allCards])

    useEffect(() => {
        if (filter !== initialCatalogueState.filter) {
            setFilteredCards(filterCards(allCards, filter, sortBy, sortDirection))
            setPage(0)
        }
    }, [filter, sortBy, sortDirection])

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        setPage(page - 1)
    }

    const firstPage = () => {
        setPage(0)
    }

    const lastPage = () => {
        setPage(Math.ceil(filteredCards.length / pageSize) - 1)
    }

    const changeSortBy = (sortBy: SortEnum) => {
        setSort({ sortBy })
    }

    const changeSortDirection = (sortDirection: SortDirection) => {
        setSort({ sortDirection })
    }

    const cardsToShow = useMemo(
        () => chunk(filteredCards.slice(page * pageSize, (page + 1) * pageSize), cardsPerRow),
        [filteredCards, page, pageSize, cardsPerRow],
    )

    return {
        allCards,
        done,
        cardsToShow: cardsToShow,
        page,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        disableNext: page === Math.ceil(filteredCards.length / pageSize) - 1,
        filter,
        setFilter,
        setIsFilterOpen,
        sortBy,
        sortDirection,
        changeSortBy,
        changeSortDirection,
    }
}
