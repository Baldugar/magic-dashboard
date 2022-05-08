import { useLazyQuery, useMutation } from '@apollo/client'
import addTag from 'graphql/mutations/addTag'
import addTagLink from 'graphql/mutations/addTagLink'
import removeTagLink from 'graphql/mutations/removeTagLink'
import updateTagLink from 'graphql/mutations/updateTagLink'
import updateUserCardMeta from 'graphql/mutations/updateUserCardMeta'
import getTags from 'graphql/queries/getTags'
import getUserCards from 'graphql/queries/getUserCards'
import {
    CategoryType,
    MTGACard_User,
    Query,
    RemoveTagLinkInput,
    Tag,
    TagInput,
    TagLinkInput,
    UpdateUserCardMetaInput,
} from 'graphql/types'
import { chunk } from 'lodash'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { nextTB, prevTB, TernaryBoolean } from 'utils/ternaryBoolean'

export interface useCatalogueDatabaseStateReturn {
    cardsToShow: MTGACard_User[][]
    done: boolean
    page: number
    nextPage: () => void
    prevPage: () => void
    firstPage: () => void
    lastPage: () => void
    disableNext: boolean
    setFilter: (payload: Partial<CatalogueFilterType>) => void
    filter: CatalogueFilterType
    sortBy: SortEnum
    sortDirection: SortDirection
    changeSortBy: (sortBy: SortEnum) => void
    changeSortDirection: (sortDirection: SortDirection) => void
    cardTags: Tag[]
    deckTags: Tag[]
    handleAddTag: (tag: TagInput) => void
    handleOnTagClick: (tag: Tag) => void
    handleOnTagContextMenu: (tag: Tag) => void
    selectedCard: MTGACard_User | null
    setSelectedCard: Dispatch<SetStateAction<MTGACard_User | null>>
    openCardModal: boolean
    handleAddTagLink: (input: TagLinkInput) => void
    handleUpdateTagLink: (input: TagLinkInput) => void
    handleUpdateUserCardMeta: (input: UpdateUserCardMetaInput) => void
    handleRemoveTagLink: (input: RemoveTagLinkInput) => void
}

export const useCatalogueState = (userID: string): useCatalogueDatabaseStateReturn => {
    const [filteredCards, setFilteredCards] = useState<MTGACard_User[]>([])
    const [cardTags, setCardTags] = useState<Tag[]>([])
    const [deckTags, setDeckTags] = useState<Tag[]>([])
    const [userCards, setUserCards] = useState<MTGACard_User[]>([])
    const [done, setDone] = useState<boolean>(false)
    const [page, setPage] = useState(0)
    const [cardsPerRow, setCardsPerRow] = useState(
        Math.floor((document.body.clientWidth - 100) / CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].width),
    )
    const [rowsPerPage, setRowsPerPage] = useState(
        Math.floor((document.body.clientHeight - 50) / CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL].height),
    )

    const [pageSize, setPageSize] = useState(cardsPerRow * rowsPerPage)

    const [selectedCard, setSelectedCard] = useState<MTGACard_User | null>(null)
    const openCardModal = Boolean(selectedCard)

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

    // const [getUserCardsQuery] = useLazyQuery<Query, { userID: string }>(getUserCards, {
    const [getUserCardsQuery] = useLazyQuery(getUserCards, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data.getUserCards) {
                //TODO:
                setUserCards(data.getUserCards)
                // setUserCards(data.getUserCards.slice(0, 10))
                //TODO:
                setFilteredCards(filterCards(data.getUserCards, filter, sortBy, sortDirection))
                // setFilteredCards(filterCards(data.getUserCards.slice(0, 10), filter, sortBy, sortDirection))
                setDone(true)
            }
        },
    })

    const [getTagsQuery] = useLazyQuery<Query, { data: { cardTags: Tag[]; deckTags: Tag[] } }>(getTags, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            if (data.getTags) {
                setCardTags(data.getTags.cardTags)
                setDeckTags(data.getTags.deckTags)
            }
        },
    })

    const [addTagMutation] = useMutation<{ addTag: Tag }, { tag: TagInput }>(addTag)
    const [addTagLinkMutation] = useMutation<{ addTagLink: MTGACard_User }, { input: TagLinkInput }>(addTagLink)
    const [updateTagLinkMutation] = useMutation<{ updateTagLink: MTGACard_User }, { input: TagLinkInput }>(
        updateTagLink,
    )
    const [removeTagLinkMutation] = useMutation<{ removeTagLink: MTGACard_User }, { input: RemoveTagLinkInput }>(
        removeTagLink,
    )
    const [updateUserCardMetaMutation] = useMutation<
        { updateUserCardMeta: MTGACard_User },
        { input: UpdateUserCardMetaInput }
    >(updateUserCardMeta)

    const handleAddTag = (tag: TagInput) => {
        addTagMutation({
            variables: {
                tag,
            },
            onCompleted: (response) => {
                const newTag = response.addTag
                if (newTag.categoryType === CategoryType.CARD) {
                    setCardTags([...cardTags, newTag])
                }
                if (newTag.categoryType === CategoryType.DECK) {
                    setDeckTags([...deckTags, newTag])
                }
            },
        })
    }

    const handleAddTagLink = (input: TagLinkInput) => {
        addTagLinkMutation({
            variables: {
                input,
            },
            onCompleted: (response) => {
                const responseCard = response.addTagLink
                const state = [...userCards]
                const index = state.findIndex((card) => card.card.id === responseCard.card.id)
                if (index !== -1) {
                    state[index] = responseCard
                    setUserCards(state)
                }
                const newFilteredCards = filterCards(state, filter, sortBy, sortDirection)
                if (newFilteredCards.find((card) => card.card.id === responseCard.card.id) === undefined) {
                    setPage(0)
                }
                setFilteredCards(newFilteredCards)
                setSelectedCard(responseCard)
            },
        })
    }

    const handleUpdateTagLink = (input: TagLinkInput) => {
        updateTagLinkMutation({
            variables: {
                input,
            },
            onCompleted: (response) => {
                const responseCard = response.updateTagLink
                const state = [...userCards]
                const index = state.findIndex((card) => card.card.id === responseCard.card.id)
                if (index !== -1) {
                    state[index] = responseCard
                    setUserCards(state)
                }
                const newFilteredCards = filterCards(state, filter, sortBy, sortDirection)
                console.log(newFilteredCards)
                if (newFilteredCards.find((card) => card.card.id === responseCard.card.id) === undefined) {
                    setPage(0)
                }
                setFilteredCards(newFilteredCards)
                setSelectedCard(responseCard)
            },
        })
    }

    const handleRemoveTagLink = (input: RemoveTagLinkInput) => {
        removeTagLinkMutation({
            variables: {
                input,
            },
            onCompleted: (response) => {
                const responseCard = response.removeTagLink
                const state = [...userCards]
                const index = state.findIndex((card) => card.card.id === responseCard.card.id)
                if (index !== -1) {
                    state[index] = responseCard
                    setUserCards(state)
                }
                const newFilteredCards = filterCards(state, filter, sortBy, sortDirection)
                if (newFilteredCards.find((card) => card.card.id === responseCard.card.id) === undefined) {
                    setPage(0)
                }
                setFilteredCards(newFilteredCards)
                setSelectedCard(responseCard)
            },
        })
    }

    const handleUpdateUserCardMeta = (input: UpdateUserCardMetaInput) => {
        updateUserCardMetaMutation({
            variables: {
                input,
            },
            onCompleted: (response) => {
                const responseCard = response.updateUserCardMeta
                const state = [...userCards]
                const index = state.findIndex((card) => card.card.id === responseCard.card.id)
                if (index !== -1) {
                    state[index] = responseCard
                    setUserCards(state)
                }
                const newFilteredCards = filterCards(state, filter, sortBy, sortDirection)
                if (newFilteredCards.find((card) => card.card.id === responseCard.card.id) === undefined) {
                    setPage(0)
                }
                setFilteredCards(newFilteredCards)
                setSelectedCard(responseCard)
            },
        })
    }

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }
        const handleDragStart = (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
        }
        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('dragstart', handleDragStart)
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('dragstart', handleDragStart)
        }
    }, [])

    useEffect(() => {
        if (userID) {
            console.log('LOOKING FOR CARDS FROM', userID)
            setDone(false)
            getTagsQuery().then(() => {
                getUserCardsQuery({
                    variables: {
                        input: {
                            userID,
                        },
                    },
                })
            })
        }
    }, [userID])

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
    }, [userCards])

    useEffect(() => {
        if (filter !== initialCatalogueState.filter) {
            setFilteredCards(filterCards(userCards, filter, sortBy, sortDirection))
            setPage(0)
        }
    }, [filter, sortBy, sortDirection])

    useEffect(() => {
        const currentFilter = filter.categories
        const newFilter: Record<string, TernaryBoolean> = {}
        for (const cardTag of cardTags) {
            if (currentFilter[cardTag.id]) {
                newFilter[cardTag.id] = currentFilter[cardTag.id]
            } else {
                newFilter[cardTag.id] = TernaryBoolean.UNSET
            }
        }
        for (const deckTag of deckTags) {
            if (currentFilter[deckTag.id]) {
                newFilter[deckTag.id] = currentFilter[deckTag.id]
            } else {
                newFilter[deckTag.id] = TernaryBoolean.UNSET
            }
        }
        setFilter({
            categories: newFilter,
        })
    }, [cardTags, deckTags])

    useEffect(() => {
        const unselectCard = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedCard !== null) {
                setSelectedCard(null)
            }
        }
        window.addEventListener('keyup', unselectCard)
        return () => {
            window.removeEventListener('keyup', unselectCard)
        }
    }, [selectedCard])

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

    const handleOnTagClick = (tag: Tag) => {
        const newFilter = { ...filter }
        newFilter.categories[tag.id] = nextTB(newFilter.categories[tag.id])
        console.log(newFilter)
        setFilter(newFilter)
    }

    const handleOnTagContextMenu = (tag: Tag) => {
        const newFilter = { ...filter }
        newFilter.categories[tag.id] = prevTB(newFilter.categories[tag.id])
        setFilter(newFilter)
    }

    return {
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
        sortBy,
        sortDirection,
        changeSortBy,
        changeSortDirection,
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
    }
}
