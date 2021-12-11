// given an array of objects and two indexes, swap the objects at those indexes
// then return the array

const swap = (arr: any[], i: number, j: number): any[] => {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
    return arr
}

export default swap
