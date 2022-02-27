import { Box } from '@mui/material'
import { Column } from 'components/Board/Column'
import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { GeneralState } from 'store/GeneralState/GeneralState.reducer'
import { DeckBoard, MODAL_ACTION, DECK_EDITOR_MODALS } from 'utils/types'

export interface BoardProps {
    deckBoard: DeckBoard
    baseWidth: number
    zoomFactor: number
    draggedCard: string
    stackCardsMode: boolean
    onRemoveClick: (payload: { cardIndex: number; columnIndex: number }) => void
    onAddClick: (payload: { cardIndex: number; columnIndex: number }) => void
    setModalState: (payload: { action: MODAL_ACTION; target: DECK_EDITOR_MODALS; message?: string }) => void
    setGeneralState: (payload: Partial<GeneralState>) => void
    onDeleteColumnClick: (columnIndex: number, name: string) => void
}

const Board = (props: BoardProps): JSX.Element => {
    const {
        deckBoard,
        baseWidth,
        zoomFactor,
        draggedCard,
        stackCardsMode,
        onRemoveClick,
        onAddClick,
        setModalState,
        setGeneralState,
        onDeleteColumnClick,
    } = props
    return (
        <Box>
            <Droppable droppableId={'board'} type={'column'} direction={'horizontal'}>
                {(boardProvided) => (
                    <Box
                        {...boardProvided.droppableProps}
                        ref={boardProvided.innerRef}
                        display={'flex'}
                        flexDirection={'row'}
                        // style={{ columnGap: 16 }}
                    >
                        {deckBoard.columns.length > 0 &&
                            deckBoard.columns.map((column, index) => (
                                <Column
                                    baseWidth={baseWidth}
                                    column={column}
                                    deckBoard={deckBoard}
                                    draggedCard={draggedCard}
                                    index={index}
                                    onAddClick={onAddClick}
                                    onDeleteColumnClick={onDeleteColumnClick}
                                    onRemoveClick={onRemoveClick}
                                    setGeneralState={setGeneralState}
                                    setModalState={setModalState}
                                    stackCardsMode={stackCardsMode}
                                    zoomFactor={zoomFactor}
                                    key={column.name + index}
                                />
                            ))}
                        {boardProvided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Box>
    )
}

export default Board
