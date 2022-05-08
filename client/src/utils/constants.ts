export enum CARD_IMAGE_SIZE {
    SMALL = 'small',
    NORMAL = 'normal',
    LARGE = 'large',
    BORDER_CROP = 'border_crop',
    ART_CROP = 'art_crop',
}

export const DATABASE_NAME = 'mtga-cards'
export const MTG_TYPE_DIVIDER = '—'
export const CARD_SIZE_VALUES: {
    [key in CARD_IMAGE_SIZE]: { width: number; height: number }
} = {
    art_crop: { width: 100, height: 71 },
    border_crop: { width: 100, height: 71 },
    large: { width: 100, height: 71 },
    normal: { width: 488, height: 680 },
    small: { width: 146, height: 204 },
}

export const PAGE_SIZE = 30
