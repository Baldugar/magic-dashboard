import { IDBPDatabase, openDB } from 'idb'
import { DATABASE_NAME } from 'utils/constants'

export const createObjectStore = async (tableNames: string[]): Promise<false | undefined> => {
    try {
        await openDB(DATABASE_NAME, 1, {
            upgrade(db: IDBPDatabase) {
                for (const tableName of tableNames) {
                    if (db.objectStoreNames.contains(tableName)) {
                        continue
                    }
                    db.createObjectStore(tableName, { autoIncrement: true, keyPath: 'id' })
                }
            },
        })
    } catch (error) {
        return false
    }
}

export const getValue = async (tableName: string, id: number): Promise<any> => {
    const db = await openDB(DATABASE_NAME, 1)
    const tx = db.transaction(tableName, 'readonly')
    const store = tx.objectStore(tableName)
    const result = await store.get(id)
    // console.log('Get Data ', result)
    return result
}

export const getAllValue = async (tableName: string): Promise<any> => {
    const db = await openDB(DATABASE_NAME, 1)
    const tx = db.transaction(tableName, 'readonly')
    const store = tx.objectStore(tableName)
    const result = await store.getAll()
    // console.log('Get All Data', result)
    return result
}

export const putValue = async (tableName: string, value: Record<string, unknown>): Promise<any> => {
    const db = await openDB(DATABASE_NAME, 1)
    const tx = db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    const result = await store.put(value)
    // console.log('Put Data ', result)
    return result
}

export const putBulkValue = async (tableName: string, values: Record<string, unknown>[]): Promise<any> => {
    const db = await openDB(DATABASE_NAME, 1)
    const tx = db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    for (const value of values) {
        // const result =
        await store.put(value)
        // console.log('Put Bulk Data ', result)
    }
    return getAllValue(tableName)
}

export const deleteValue = async (tableName: string, id: number | string): Promise<any> => {
    const db = await openDB(DATABASE_NAME, 1)
    const tx = db.transaction(tableName, 'readwrite')
    const store = tx.objectStore(tableName)
    const result = await store.get(id)
    if (!result) {
        // console.log('Id not found', id)
        return result
    }
    await store.delete(id)
    // console.log('Deleted Data', id)
    return id
}
