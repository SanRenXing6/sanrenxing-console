export const insert = (array: any, index: number, newItem: any) => [
    ...array.slice(0, index),
    newItem,
    ...array.slice(index)
]

export const remove = (array: any, index: number) => [
    ...array.slice(0, index),
    ...array.slice(index + 1)
]