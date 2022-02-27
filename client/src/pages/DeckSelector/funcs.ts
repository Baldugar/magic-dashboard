import { Dispatch, SetStateAction } from 'react'
import { MTGACard } from 'utils/types'

export const fetchCards = (
    query: string,
    setMtgaCards: Dispatch<SetStateAction<any[]>>,
    setDone: Dispatch<SetStateAction<boolean>>,
): void => {
    fetch(query)
        .then((response) => response.json())
        .then((data) => {
            setMtgaCards((curr) => [...curr, ...(data.data as MTGACard[]).map((card) => ({ ...card, categories: [] }))])
            if (data.has_more) {
                fetchCards(data.next_page, setMtgaCards, setDone)
            } else {
                console.log('DONE')
                setDone(true)
            }
        })
}

export const computeSubtypes = (mtgaCreatures: any[]): string[] =>
    mtgaCreatures.reduce((acc, curr) => {
        if (curr.type_line.includes('Creature')) {
            const subtypes = curr.type_line.split(' — ')[1]
            if (subtypes) {
                const subtypeArray = subtypes.split(' ')
                for (const subtype of subtypeArray) {
                    if (!acc.includes(subtype) && subtype !== '//') {
                        acc.push(subtype)
                    }
                }
            } else {
                console.log(curr.name, curr.type_line)
            }
        }
        return acc
    }, [])
