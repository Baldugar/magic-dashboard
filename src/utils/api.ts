const BASE_URL = 'https://api.scryfall.com/'

export enum API_CALL_TYPE {
    CARDS = 'cards/search',
}

export type API_FUNCTION = { type: API_CALL_TYPE.CARDS; name: string }

export const URLforAPIFunction = (call: API_FUNCTION): string => {
    switch (call.type) {
        case API_CALL_TYPE.CARDS:
            const url = BASE_URL + `${call.type}?q=${call.name}`
            return url
        default:
            return BASE_URL + `${call.type}`
    }
}

export const sendAPIRequest = async <T>(func: API_FUNCTION, method: 'GET' | 'POST'): Promise<T> => {
    const url = URLforAPIFunction(func)
    return fetch(url, {
        method,
    }).then((r) => {
        return r.json() as Promise<T>
    })
}
