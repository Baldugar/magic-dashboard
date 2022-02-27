export enum TernaryBoolean {
    UNSET = 0,
    TRUE = 1,
    FALSE = 2,
}

export const nextTB = (current: TernaryBoolean | undefined): TernaryBoolean => {
    return current ? (current + 1) % 3 : TernaryBoolean.TRUE
}

export const isUnsetTB = (current: TernaryBoolean | undefined): boolean => {
    return current === undefined && current === TernaryBoolean.UNSET
}

export const isNotUnsetTB = (current: TernaryBoolean | undefined): boolean => {
    return current !== undefined && current !== TernaryBoolean.UNSET
}

export const isPositiveTB = (current: TernaryBoolean | undefined): boolean => {
    return current !== undefined && current === TernaryBoolean.TRUE
}

export const isNotPositiveTB = (current: TernaryBoolean | undefined): boolean => {
    return current !== undefined && current !== TernaryBoolean.TRUE
}

export const isNegativeTB = (current: TernaryBoolean | undefined): boolean => {
    return current !== undefined && current === TernaryBoolean.FALSE
}

export const isNotNegativeTB = (current: TernaryBoolean | undefined): boolean => {
    return current !== undefined && current !== TernaryBoolean.FALSE
}
