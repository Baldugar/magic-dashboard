import { Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import React, { DetailedHTMLProps, useState } from 'react'

const BoardCard = (
    props: DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
): JSX.Element => {
    const { width, height } = props

    const [loaded, setLoaded] = useState(false)

    const aspectRatio = 12 / 17
    return (
        <Box
            position={'relative'}
            width={width}
            height={
                typeof width === 'string' && width.includes('vw')
                    ? `${Number(width.split('vw')[0]) / aspectRatio}vw`
                    : Number(width) / aspectRatio
            }
        >
            {loaded === false && (
                <Skeleton
                    animation={'wave'}
                    variant="rectangular"
                    width={width}
                    height={
                        height
                            ? height
                            : typeof width === 'string' && width.includes('vw')
                            ? `${Number(width.split('vw')[0]) / aspectRatio}vw`
                            : Number(width) / aspectRatio
                    }
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                />
            )}
            <img {...props} onLoad={() => setLoaded(true)} style={{ width }} />
        </Box>
    )
}

export default BoardCard
