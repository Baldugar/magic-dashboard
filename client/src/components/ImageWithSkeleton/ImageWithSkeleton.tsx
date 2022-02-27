import { Skeleton } from '@mui/material'
import React, { MouseEventHandler, useState } from 'react'
import { CARD_SIZE_VALUES } from 'utils/constants'
import { CARD_IMAGE_SIZE } from 'utils/types'

export interface ImageWithSkeletonProps {
    img: string
    scale?: number
    imageSize: CARD_IMAGE_SIZE
    onClick?: MouseEventHandler<HTMLImageElement>
    onContextMenu?: MouseEventHandler<HTMLImageElement>
    setHover?: (hover: boolean) => void
}

const ImageWithSkeleton = (props: ImageWithSkeletonProps): JSX.Element => {
    const { img, scale, onClick, onContextMenu, setHover, imageSize } = props
    const [loaded, setLoaded] = useState(false)

    const { height, width } = CARD_SIZE_VALUES[imageSize]

    const style: any = {}
    style.display = loaded ? 'block' : 'hidden'
    style.width = loaded ? `${width * (scale ?? 1)}px` : undefined
    style.height = loaded ? `${height * (scale ?? 1)}px` : undefined
    style.cursor = onClick ? 'pointer' : undefined

    return (
        <>
            <img
                onClick={onClick}
                onContextMenu={onContextMenu}
                onMouseOver={setHover ? () => setHover(true) : undefined}
                onMouseLeave={setHover ? () => setHover(false) : undefined}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                src={img}
                style={style}
            />
            {!loaded && <Skeleton variant="rectangular" width={width * (scale ?? 1)} height={height * (scale ?? 1)} />}
        </>
    )
}

export default ImageWithSkeleton
