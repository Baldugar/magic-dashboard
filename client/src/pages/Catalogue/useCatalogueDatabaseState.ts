import { MTGACard_User } from 'graphql/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { fetchCards } from 'utils/funcs'

export interface useCatalogueDatabaseStateReturn {
    cardsToShow: MTGACard_User[]
    done: boolean
    setCardsToShow: Dispatch<SetStateAction<MTGACard_User[]>>
}

export const useCatalogueDatabaseState = (): useCatalogueDatabaseStateReturn => {
    // const mtgaCreaturesQuery = 'https://api.scryfall.com/cards/search?q=game%3Aarena'
    const mtgaCreaturesQuery = 'https://api.scryfall.com/cards/search?q=game%3Aarena+and+unique%3Aprints'
    const [cardsToShow, setCardsToShow] = useState<MTGACard_User[]>([])
    const [done, setDone] = useState<boolean>(false)

    useEffect(() => {
        fetchCards(mtgaCreaturesQuery, setCardsToShow, setDone)
    }, [])

    return {
        done,
        cardsToShow,
        setCardsToShow,
    }
}
