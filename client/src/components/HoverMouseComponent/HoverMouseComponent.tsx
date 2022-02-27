import { Portal } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'

export interface HoverMouseComponentProps {
    visible: boolean
    imgSrc: string
}

const HoverMouseComponent = (props: HoverMouseComponentProps): JSX.Element | null => {
    const { visible, imgSrc } = props

    const [x, setX] = React.useState<number>(0)
    const [y, setY] = React.useState<number>(0)

    const zoomCardWidth = 488
    const zoomCardHeight = 680
    const [closeToEdge, setCloseToEdge] = React.useState<{
        bottom: boolean
        right: boolean
    }>({
        bottom: false,
        right: false,
    })

    const modDefaultValue = 10
    const scaleDefaultValue = 0.7

    const handleMouseMove = (e: MouseEvent): void => {
        if (visible) {
            const calculatedCloseToEdge: {
                bottom: boolean
                right: boolean
            } = closeToEdge
            if (document.body.clientWidth < e.clientX + modDefaultValue + zoomCardWidth * scaleDefaultValue) {
                calculatedCloseToEdge.right = true
            } else {
                calculatedCloseToEdge.right = false
            }
            if (document.body.clientHeight < e.clientY + modDefaultValue + zoomCardHeight * scaleDefaultValue) {
                calculatedCloseToEdge.bottom = true
            } else {
                calculatedCloseToEdge.bottom = false
            }
            setCloseToEdge(calculatedCloseToEdge)
            setX(e.clientX)
            setY(e.clientY)
        }
    }

    const calculateTransformationalProperties = (closeToEdge: {
        bottom: boolean
        right: boolean
    }): {
        xMod: number
        yMod: number
        transformOrigin: string
        scale: number
    } => {
        if (closeToEdge.bottom && closeToEdge.right) {
            return {
                scale: scaleDefaultValue,
                xMod: -zoomCardWidth - modDefaultValue,
                yMod: -zoomCardHeight - modDefaultValue,
                transformOrigin: 'bottom right',
            }
        } else if (closeToEdge.bottom) {
            return {
                scale: scaleDefaultValue,
                xMod: modDefaultValue,
                yMod: -zoomCardHeight - modDefaultValue,
                transformOrigin: 'bottom left',
            }
        } else if (closeToEdge.right) {
            return {
                scale: scaleDefaultValue,
                xMod: -zoomCardWidth - modDefaultValue,
                yMod: modDefaultValue,
                transformOrigin: 'top right',
            }
        } else {
            return {
                scale: scaleDefaultValue,
                xMod: modDefaultValue,
                yMod: modDefaultValue,
                transformOrigin: 'top left',
            }
        }
    }

    useEffect(() => {
        if (visible) {
            window.addEventListener('mousemove', handleMouseMove)
        }
        return (): void => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [visible])

    if (!visible) {
        return null
    }

    const { transformOrigin, xMod, yMod, scale } = calculateTransformationalProperties(closeToEdge)

    return (
        <Portal>
            <Box
                position={'absolute'}
                top={y + yMod}
                left={x + xMod}
                zIndex={10000}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: transformOrigin,
                }}
            >
                <img src={imgSrc} loading={'lazy'} />
            </Box>
        </Portal>
    )
}

export default HoverMouseComponent
