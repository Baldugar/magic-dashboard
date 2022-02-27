import { fetchCards, computeSubtypes } from 'pages/DeckSelector/funcs'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'

export interface UseDeckSelectorStateReturn {
    mtgaCreatures: any[]
    mtgaCreatureSubtypes: string[]
    selectedCreatureSubtype: string
    setSelectedCreatureSubtype: Dispatch<SetStateAction<string>>
}

export const useDeckSelectorState = (): UseDeckSelectorStateReturn => {
    const mtgaCreaturesQuery = 'https://api.scryfall.com/cards/search?q=game%3Aarena+and+t%3Acreature+and+ci%3Aug'

    const [mtgaCreatures, setMtgaCreatures] = useState<any[]>([])
    const [mtgaCreatureSubtypes, setMtgaCreatureSubtypes] = useState<string[]>([])
    const [done, setDone] = useState<boolean>(false)
    const [selectedCreatureSubtype, setSelectedCreatureSubtype] = useState<string>('')

    useEffect(() => {
        if (mtgaCreatures.length === 0) {
            fetchCards(mtgaCreaturesQuery, setMtgaCreatures, setDone)
        }
    }, [])

    useEffect(() => {
        if (done) {
            setMtgaCreatureSubtypes(computeSubtypes(mtgaCreatures))
        }
    }, [done, mtgaCreatures])

    return {
        mtgaCreatures,
        mtgaCreatureSubtypes,
        selectedCreatureSubtype,
        setSelectedCreatureSubtype,
    }
}
