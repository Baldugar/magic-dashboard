import { Add, Remove } from '@material-ui/icons'
import { Search } from '@mui/icons-material'
import { ButtonBase, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import BoardCard from 'components/Board/BoardCard'
import { isEqual } from 'lodash'
import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import colors from 'utils/colors'
import { Card } from 'utils/types'

export interface ColumnWrapperProps {
    cards: Card[]
    columnIndex: number
    baseWidth: number
    zoomFactor: number
    draggedCard: string
    maxCards: number
    stackCardsMode: boolean
    onRemoveClick: (payload: { cardIndex: number; columnIndex: number }) => void
    onAddClick: (payload: { cardIndex: number; columnIndex: number }) => void
    onDetailsClick: (payload: Card) => void
}

const ColumnWrapper = (props: ColumnWrapperProps): JSX.Element => {
    const {
        cards,
        baseWidth,
        zoomFactor,
        draggedCard,
        maxCards,
        stackCardsMode,
        onRemoveClick,
        onAddClick,
        columnIndex,
        onDetailsClick,
    } = props
    const [hover, setHover] = useState('')
    const aspectRatio = 12 / 17

    const getDraggedIndex = (): number => {
        if (draggedCard.length > 0) {
            const cardInThisColumn = cards.find(
                (card) => draggedCard === `draggable-${card.set + card.number + card.name}`,
            )
            if (cardInThisColumn) {
                const index = cards.indexOf(cardInThisColumn)
                return index
            }
        }
        return -1
    }

    return (
        <Box
            style={{
                position: 'relative',
                backgroundColor: colors.darkGray,
                paddingLeft: 8,
                paddingRight: 8,
                paddingBottom: 24,
                paddingTop: 8,
                width: baseWidth * zoomFactor + 16,
                height: stackCardsMode
                    ? 27 +
                      (baseWidth * zoomFactor) / aspectRatio +
                      (maxCards - 1) * (3 + ((baseWidth * zoomFactor) / aspectRatio / 4) * 3)
                    : 27 +
                      (baseWidth * zoomFactor) / aspectRatio +
                      (maxCards - 1) * ((baseWidth * zoomFactor) / aspectRatio),
            }}
        >
            {cards.map((card, index) => {
                return (
                    <Draggable
                        key={card.set + card.number + card.name}
                        draggableId={`draggable-${card.set + card.number + card.name}`}
                        index={index}
                        disableInteractiveElementBlocking
                    >
                        {(provided, snapshot) => {
                            return (
                                <Box
                                    onMouseOver={() => {
                                        setHover(`draggable-${index + card.name}`)
                                    }}
                                    onMouseLeave={() => setHover('')}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={
                                        snapshot.isDragging === false
                                            ? {
                                                  ...provided.draggableProps.style,
                                                  position: 'relative',
                                                  top: stackCardsMode
                                                      ? index > 0
                                                          ? -(((baseWidth * zoomFactor) / aspectRatio) * 0.37) *
                                                            (getDraggedIndex() !== -1 && getDraggedIndex() < index
                                                                ? index - 1
                                                                : index)
                                                          : 0
                                                      : undefined,
                                                  zIndex:
                                                      hover === `draggable-${index + card.name}`
                                                          ? 100000
                                                          : 100 * (index + 1),
                                              }
                                            : { ...provided.draggableProps.style }
                                    }
                                >
                                    <Box position={'relative'}>
                                        <Box
                                            position={'absolute'}
                                            top={0}
                                            bottom={0}
                                            left={0}
                                            right={0}
                                            bgcolor={`rgba(0, 0, 0, ${
                                                hover === `draggable-${index + card.name}` ? 0.5 : 0
                                            })`}
                                            style={{
                                                // opacity: hover === `draggable-${index+ card.name}` ? 1 : 0,
                                                // transition: 'opacity 250ms',
                                                transition: 'background-color 250ms',
                                                borderRadius: (baseWidth * zoomFactor) / 16,
                                                zIndex:
                                                    hover === `draggable-${index + card.name}`
                                                        ? 100001
                                                        : 100 * (index + 1),
                                            }}
                                            display={'flex'}
                                            flexDirection={'column'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            <Typography
                                                fontSize={200 * zoomFactor}
                                                style={{
                                                    opacity: hover === `draggable-${index + card.name}` ? 1 : 0.3,
                                                    transition: 'opacity 250ms',
                                                }}
                                            >
                                                {card.numOfCards}
                                            </Typography>
                                            {card.isCommander && (
                                                <Typography
                                                    fontSize={50 * zoomFactor}
                                                    style={{
                                                        opacity: hover === `draggable-${index + card.name}` ? 1 : 0.3,
                                                        transition: 'opacity 250ms',
                                                    }}
                                                >
                                                    {`Commander`}
                                                </Typography>
                                            )}
                                            {card.isCompanion && (
                                                <Typography
                                                    fontSize={50 * zoomFactor}
                                                    style={{
                                                        opacity: hover === `draggable-${index + card.name}` ? 1 : 0.3,
                                                        transition: 'opacity 250ms',
                                                    }}
                                                >
                                                    {`Companion`}
                                                </Typography>
                                            )}
                                            {card.isCommander === undefined && card.isCompanion === undefined && (
                                                <Box
                                                    width={'50%'}
                                                    height={'10%'}
                                                    borderRadius={8 * zoomFactor}
                                                    bgcolor={colors.midGray}
                                                    display={'flex'}
                                                    flexDirection={'row'}
                                                    overflow={'hidden'}
                                                    style={{
                                                        opacity: hover === `draggable-${index + card.name}` ? 1 : 0,
                                                        transition: 'opacity 250ms',
                                                    }}
                                                >
                                                    <ButtonBase
                                                        onClick={() =>
                                                            onRemoveClick({
                                                                cardIndex: index,
                                                                columnIndex,
                                                            })
                                                        }
                                                        style={{ flex: 1, borderRight: `1px solid ${colors.black}` }}
                                                    >
                                                        <Remove
                                                            style={{ width: 50 * zoomFactor, height: 50 * zoomFactor }}
                                                        />
                                                    </ButtonBase>
                                                    <ButtonBase
                                                        onClick={() =>
                                                            onAddClick({
                                                                cardIndex: index,
                                                                columnIndex,
                                                            })
                                                        }
                                                        style={{ flex: 1, borderLeft: `1px solid ${colors.black}` }}
                                                    >
                                                        <Add
                                                            style={{ width: 50 * zoomFactor, height: 50 * zoomFactor }}
                                                        />
                                                    </ButtonBase>
                                                </Box>
                                            )}
                                            <Box
                                                style={{
                                                    height: '10%',
                                                    position: 'absolute',
                                                    bottom: 10,
                                                    left: 0,
                                                    right: 0,
                                                    opacity: hover === `draggable-${index + card.name}` ? 1 : 0,
                                                    transition: 'opacity 250ms',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <IconButton
                                                    sx={{ color: 'text.primary' }}
                                                    onClick={() => onDetailsClick(card)}
                                                >
                                                    <Search />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <BoardCard
                                            src={
                                                card.image_uris
                                                    ? card.image_uris.border_crop
                                                    : card.card_faces
                                                    ? card.card_faces[0].image_uris
                                                        ? card.card_faces[0].image_uris.border_crop
                                                        : undefined
                                                    : undefined
                                            }
                                            width={baseWidth * zoomFactor}
                                            style={{
                                                borderRadius: (baseWidth * zoomFactor) / 16,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )
                        }}
                    </Draggable>
                )
            })}
        </Box>
    )
}

ColumnWrapper.displayName = 'ColumnWrapper'

export default React.memo(ColumnWrapper, (prevProps, nextProps) => {
    const shouldNotRender =
        prevProps.cards.length === nextProps.cards.length &&
        isEqual(prevProps.cards, nextProps.cards) &&
        prevProps.columnIndex === nextProps.columnIndex &&
        prevProps.maxCards === nextProps.maxCards &&
        prevProps.stackCardsMode === nextProps.stackCardsMode &&
        prevProps.zoomFactor === nextProps.zoomFactor

    return shouldNotRender
})
