import { clamp } from 'lodash'
import React, { useEffect } from 'react'

// export interface SearchPanelProps {
//     visible: boolean
// }

// export const SearchPanel = (props: SearchPanelProps): JSX.Element | null => {
//     const { visible } = props

//     return (
//         <Draggable
//             axis={'both'}
//             bounds={'parent'}
//             // handle={'.handleMe'}
//         >
//             <div style={{ width: 100, height: 100, backgroundColor: 'teal' }}></div>
//         </Draggable>
//     )
// }

export interface SearchPanelProps {
    // onSearch: (searchText: string) => void
    // key: string | number
    visible: boolean
    bgColor: string
    // onClose: () => void
}

export const SearchPanel = (props: SearchPanelProps): JSX.Element | null => {
    // const { onSearch, key, visible, onClose } = props
    const { visible, bgColor } = props
    const [x, setX] = React.useState(0)
    const [y, setY] = React.useState(0)
    const [xDelta, setXDelta] = React.useState(0)
    const [yDelta, setYDelta] = React.useState(0)
    const [searchText, setSearchText] = React.useState('')
    const [isLocked, setIsLocked] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)

    useEffect(() => {
        const handleResizeWindow = () => {
            setX(clamp(x, 0, window.innerWidth - 100))
            setY(clamp(y, 0, window.innerHeight - 100))
        }

        window.addEventListener('resize', handleResizeWindow)

        return () => window.removeEventListener('resize', handleResizeWindow)
    }, [x, y])

    useEffect(() => {
        const handleMoveMouse = (ev: MouseEvent) => {
            if (isDragging) {
                setX(clamp(ev.pageX - xDelta, 0, window.innerWidth - 100))
                setY(clamp(ev.pageY - yDelta, 0, window.innerHeight - 100))
            }
        }

        window.addEventListener('mousemove', handleMoveMouse)

        return () => window.removeEventListener('mousemove', handleMoveMouse)
    }, [isDragging, xDelta, yDelta])

    useEffect(() => {
        const handler = () => {
            console.log('MOUSELEAVE')
            if (isDragging) {
                setIsDragging(false)
            }
        }

        document.addEventListener('mouseleave', handler)
        document.addEventListener('mouseup', handler)

        return () => {
            document.removeEventListener('mouseleave', handler)
            document.removeEventListener('mouseup', handler)
        }
    }, [isDragging])

    if (!visible) {
        return null
    }

    const startDragging = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        setIsDragging(true)
        setXDelta(e.pageX - x)
        setYDelta(e.pageY - y)
    }
    // const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    //     e.preventDefault()
    //     if (isDragging) {
    //         setX(clamp(e.pageX - xDelta, 0, window.innerWidth - 100))
    //         setY(clamp(e.pageY - yDelta, 0, window.innerHeight - 100))
    //     }
    // }

    return (
        <div
            style={{
                width: 100,
                height: 100,
                position: 'absolute',
                top: y,
                left: x,
                backgroundColor: bgColor,
                //    , transform: `translate(${x}px, ${y}px)`
            }}
            draggable={!isLocked}
            // onDrag={onDrag}
            onMouseDown={startDragging}
        ></div>
    )
}
