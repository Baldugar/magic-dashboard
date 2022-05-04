import { Box } from '@mui/system'
import HoverMouseComponent from 'components/HoverMouseComponent'
import ImageWithSkeleton from 'components/ImageWithSkeleton'
import { MTGACard } from 'graphql/types'
import React, { MouseEventHandler, useState } from 'react'
import { CARD_IMAGE_SIZE, CARD_SIZE_VALUES } from 'utils/constants'

export interface CardWithHoverProps {
    card: MTGACard | undefined
    selected?: boolean
    onClick?: MouseEventHandler<HTMLImageElement>
    onContextMenu?: MouseEventHandler<HTMLImageElement>
    hideHover?: boolean
    scale?: number
}

const CardWithHover = (props: CardWithHoverProps): JSX.Element | null => {
    const { card, hideHover, selected, onClick, onContextMenu, scale } = props
    const [hover, setHover] = useState(false)

    if (!card) {
        return null
    }

    const { normal, small } = card.image_uris ?? card.card_faces?.[0].image_uris ?? {}

    if (!small) {
        return null
    }

    const { height, width } = CARD_SIZE_VALUES[CARD_IMAGE_SIZE.SMALL]

    return (
        <>
            <Box
                display={'flex'}
                flexDirection={'row'}
                position={'relative'}
                width={width * (scale ?? 1)}
                height={height * (scale ?? 1)}
                // style={scale ? { transform: `scale(${scale})` } : undefined}
            >
                <ImageWithSkeleton
                    imageSize={CARD_IMAGE_SIZE.SMALL}
                    img={small}
                    onClick={onClick}
                    onContextMenu={onContextMenu}
                    setHover={setHover}
                    scale={scale}
                />
                {selected && (
                    <Box
                        width={`${width}px`}
                        height={`${height}px`}
                        bgcolor={'rgba(255,255,255,0.3)'}
                        style={onClick ? { cursor: 'pointer' } : undefined}
                        zIndex={10}
                        position={'absolute'}
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        onClick={onClick}
                    />
                )}
            </Box>
            {normal && (
                <HoverMouseComponent
                    visible={hover && (hideHover === false || hideHover === undefined)}
                    imgSrc={normal}
                />
            )}
        </>
    )
}

export default CardWithHover
