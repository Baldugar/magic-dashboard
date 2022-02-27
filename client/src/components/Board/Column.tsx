import { Delete, DragIndicator, Edit, Settings } from '@mui/icons-material'
import {
    Box,
    ClickAwayListener,
    Grow,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Typography,
} from '@mui/material'
import ColumnContentWrapper from 'components/Board/ColumnContentWrapper'
import { maxBy } from 'lodash'
import React, { KeyboardEvent, SyntheticEvent, useRef, useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { GeneralState } from 'store/GeneralState/GeneralState.reducer'
import colors from 'utils/colors'
import { MODAL_ACTION, DECK_EDITOR_MODALS, BoardColumn, Card, DeckBoard } from 'utils/types'

export interface ColumnProps {
    index: number
    column: BoardColumn
    baseWidth: number
    zoomFactor: number
    stackCardsMode: boolean
    draggedCard: string
    onDeleteColumnClick: (columnIndex: number, name: string) => void
    setGeneralState: (payload: Partial<GeneralState>) => void
    setModalState: (payload: { action: MODAL_ACTION; target: DECK_EDITOR_MODALS; message?: string }) => void
    deckBoard: DeckBoard
    onRemoveClick: (payload: { cardIndex: number; columnIndex: number }) => void
    onAddClick: (payload: { cardIndex: number; columnIndex: number }) => void
}

export const Column = (props: ColumnProps): JSX.Element => {
    const {
        index,
        column,
        baseWidth,
        zoomFactor,
        onDeleteColumnClick,
        setGeneralState,
        setModalState,
        deckBoard,
        draggedCard,
        stackCardsMode,
        onAddClick,
        onRemoveClick,
    } = props
    const anchorRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event: Event | SyntheticEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }

        setOpen(false)
    }

    const handleListKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault()
            setOpen(false)
        } else if (event.key === 'Escape') {
            setOpen(false)
        }
    }

    return (
        <>
            <Draggable index={index} draggableId={`draggable-column-${column.name}`} key={column.name}>
                {(columnDragProvided) => (
                    <Box
                        {...columnDragProvided.draggableProps}
                        ref={columnDragProvided.innerRef}
                        flex={1}
                        ml={2}
                        maxWidth={baseWidth * zoomFactor + 16}
                    >
                        <Box
                            width={1}
                            bgcolor={colors.black}
                            sx={{
                                borderColor: 'secondary.main',
                                borderWidth: '2px',
                                borderStyle: 'solid',
                            }}
                            {...columnDragProvided.dragHandleProps}
                        >
                            <Box position={'relative'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <IconButton
                                    color={'primary'}
                                    onClick={() => onDeleteColumnClick(index, column.name)}
                                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}
                                >
                                    <Delete />
                                </IconButton>
                                <DragIndicator style={{ transform: 'rotate(90deg)' }} />
                                <IconButton ref={anchorRef} onClick={handleToggle} color={'primary'}>
                                    <Settings />
                                </IconButton>
                                <IconButton
                                    color={'primary'}
                                    onClick={() => {
                                        setGeneralState({
                                            columnToEdit: { columnIndex: index, name: column.name },
                                        })
                                        setModalState({
                                            action: MODAL_ACTION.OPEN,
                                            target: DECK_EDITOR_MODALS.EDIT_COLUMN,
                                        })
                                    }}
                                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}
                                >
                                    <Edit />
                                </IconButton>
                            </Box>
                            <Box width={1} padding={'10px 8px'}>
                                <Typography
                                    whiteSpace={'nowrap'}
                                    textOverflow={'ellipsis'}
                                    width={'100%'}
                                    overflow={'hidden'}
                                    align={'center'}
                                >{`${column.name}`}</Typography>
                            </Box>
                            <Box display={'flex'} flexDirection={'row'}>
                                <Box
                                    position={'relative'}
                                    flex={1}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    padding={'10px'}
                                >
                                    <Typography fontSize={'11px'} textAlign={'center'}>
                                        Unique cards
                                    </Typography>
                                    <Typography>{column.cards.length}</Typography>
                                </Box>
                                <Box
                                    position={'relative'}
                                    flex={1}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    padding={'10px'}
                                >
                                    <Typography fontSize={'11px'} textAlign={'center'}>
                                        Total cards
                                    </Typography>
                                    <Typography>
                                        {column.cards.reduce((acc, next) => acc + next.numOfCards, 0)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Droppable droppableId={`droppable-${column.name}`} type={'card'}>
                            {(columnDropProvided) => (
                                <Box
                                    ref={columnDropProvided.innerRef}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    flex={1}
                                    {...columnDropProvided.droppableProps}
                                >
                                    <ColumnContentWrapper
                                        onDetailsClick={(card: Card) => {
                                            setGeneralState({ selectedCard: card })
                                            setModalState({
                                                action: MODAL_ACTION.OPEN,
                                                target: DECK_EDITOR_MODALS.CARD_DETAILS,
                                            })
                                        }}
                                        columnIndex={index}
                                        baseWidth={baseWidth}
                                        zoomFactor={zoomFactor}
                                        stackCardsMode={stackCardsMode}
                                        cards={column.cards}
                                        draggedCard={draggedCard}
                                        maxCards={
                                            maxBy(deckBoard.columns, (c) => c.cards.length)?.cards.length ??
                                            column.cards.length
                                        }
                                        onAddClick={onAddClick}
                                        onRemoveClick={onRemoveClick}
                                    />
                                    {columnDropProvided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </Box>
                )}
            </Draggable>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                disablePortal
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: '100% 0 0',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    onKeyDown={handleListKeyDown}
                                    sx={{
                                        borderColor: 'secondary.main',
                                        borderWidth: '2px',
                                        borderStyle: 'solid',
                                        backgroundColor: colors.black,
                                        flexDirection: 'column',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        rowGap: '10px',
                                    }}
                                >
                                    <MenuItem onClick={() => onDeleteColumnClick(index, column.name)}>
                                        <ListItemIcon>
                                            <Delete color={'primary'} />
                                        </ListItemIcon>
                                        <ListItemText>Delete Column</ListItemText>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            setGeneralState({
                                                columnToEdit: { columnIndex: index, name: column.name },
                                            })
                                            setModalState({
                                                action: MODAL_ACTION.OPEN,
                                                target: DECK_EDITOR_MODALS.EDIT_COLUMN,
                                            })
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Edit color={'primary'} />
                                        </ListItemIcon>
                                        <ListItemText>Edit Column</ListItemText>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    )
}
