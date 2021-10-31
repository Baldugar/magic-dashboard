import { Box, Fade, Slider } from '@mui/material'
import Board from 'components/Board'
import Header from 'components/Header'
import Modals from 'components/Modals'
import React, { Dispatch, useCallback, useEffect, useRef, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import GeneralStateActions, { GeneralStateAction } from 'store/GeneralState/GeneralState.actions'
import { GeneralState } from 'store/GeneralState/GeneralState.reducer'
import { AppState } from 'store/store'
import colors from 'utils/colors'
import { generateExportDeck, generateDeckBoard, onDragEnd, downloadExportedDeck } from 'utils/funcs'
import { Deck, DeckBoard, MODALS, MODAL_ACTION, SETTINGS } from 'utils/types'

const FirstPage = (): JSX.Element => {
    const [importedDeck, setImportedDeck] = useState<Deck>()
    const [draggedCard, setDraggedCard] = useState<string>('')
    const textFieldRef = useRef<HTMLTextAreaElement>()
    const baseWidth = 480
    const initialZoomFactor = 0.3
    const [zoomFactor, setZoomFactor] = useState(initialZoomFactor)

    const { generalState } = useSelector((appState: AppState) => ({
        generalState: appState.generalState,
    }))
    const { modals, loadingMessage, settings, deckBoard, cardToDelete, columnToEdit, selectedCard } = generalState
    const dispatch = useDispatch<Dispatch<GeneralStateActions>>()

    const setModalState = useCallback(
        (payload: { action: MODAL_ACTION; target: MODALS }) => {
            dispatch({ type: GeneralStateAction.SET_MODAL_STATE, payload })
        },
        [dispatch],
    )
    const setSettings = useCallback(
        (payload: { setting: SETTINGS; value: boolean }) => {
            dispatch({ type: GeneralStateAction.SET_SETTINGS, payload })
        },
        [dispatch],
    )
    const setGeneralState = useCallback(
        (payload: Partial<GeneralState>) => {
            dispatch({ type: GeneralStateAction.SET_GENERAL_STATE, payload })
        },
        [dispatch],
    )
    const setDeckBoard = useCallback(
        (payload: DeckBoard) => {
            dispatch({ type: GeneralStateAction.SET_DECK_BOARD, payload })
        },
        [dispatch],
    )
    const addCard = useCallback(
        (payload: { cardIndex: number; columnIndex: number }) => {
            dispatch({ type: GeneralStateAction.ADD_CARD, payload })
        },
        [dispatch],
    )
    const removeCard = useCallback(
        (payload: { cardIndex: number; columnIndex: number }) => {
            dispatch({ type: GeneralStateAction.REMOVE_CARD, payload })
        },
        [dispatch],
    )
    const editColumn = useCallback(
        (payload: { columnIndex: number; newName: string }) => {
            dispatch({ type: GeneralStateAction.EDIT_COLUMN, payload })
        },
        [dispatch],
    )
    const deleteColumn = useCallback(
        (payload: number) => {
            dispatch({ type: GeneralStateAction.DELETE_COLUMN, payload })
        },
        [dispatch],
    )

    useEffect(() => {
        if (importedDeck !== undefined) {
            setDeckBoard(generateDeckBoard(importedDeck))
            setModalState({ target: MODALS.IMPORT_DECK, action: MODAL_ACTION.CLOSE })
        }
    }, [importedDeck])

    const createColumn = () => {
        const columnName = textFieldRef?.current?.value.trim()
        if (columnName && columnName.length > 0) {
            const columnNameAlreadyExists = deckBoard.columns.find((c) => c.name === columnName)
            if (columnNameAlreadyExists) {
                let foundUnusedCopyName = false
                let i = 1
                while (foundUnusedCopyName === false) {
                    foundUnusedCopyName = deckBoard.columns.find((c) => c.name === `${columnName} (${i})`) === undefined
                    if (foundUnusedCopyName === false) {
                        i++
                    }
                }
                setDeckBoard({
                    ...deckBoard,
                    columns: [...deckBoard.columns, { name: `${columnName} (${i})`, cards: [] }],
                })
            } else {
                setDeckBoard({
                    ...deckBoard,
                    columns: [...deckBoard.columns, { name: columnName, cards: [] }],
                })
            }
        }
    }

    const handleEditColumn = () => {
        const newColumnName = textFieldRef?.current?.value.trim()
        if (
            newColumnName &&
            newColumnName.length > 0 &&
            columnToEdit &&
            newColumnName !== deckBoard.columns[columnToEdit.columnIndex].name
        ) {
            const columnNameAlreadyExists = deckBoard.columns.find((c) => c.name === newColumnName)
            if (columnNameAlreadyExists) {
                let foundUnusedCopyName = false
                let i = 1
                while (foundUnusedCopyName === false) {
                    foundUnusedCopyName =
                        deckBoard.columns.find((c) => c.name === `${newColumnName} (${i})`) === undefined
                    if (foundUnusedCopyName === false) {
                        i++
                    }
                }
                editColumn({
                    columnIndex: columnToEdit.columnIndex,
                    newName: `${newColumnName} (${i})`,
                })
            } else {
                editColumn({
                    columnIndex: columnToEdit.columnIndex,
                    newName: newColumnName,
                })
            }
        }
    }

    return (
        <>
            <Box>
                <Header
                    deckBoard={deckBoard}
                    setModalState={setModalState}
                    generalState={generalState}
                    setSettings={setSettings}
                    exportCurrentDeckBoard={() => downloadExportedDeck(generateExportDeck(deckBoard))}
                />
                <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, deckBoard, setDeckBoard, setDraggedCard)}
                    onDragStart={(initial) => {
                        if (initial.type === 'card') {
                            setDraggedCard(initial.draggableId)
                        }
                    }}
                >
                    <Fade in={deckBoard.columns.length > 0}>
                        <Box position={'absolute'} top={50} zIndex={500} paddingTop={2} paddingBottom={2}>
                            <Board.Board
                                onDeleteColumnClick={(index, name) => {
                                    if (settings.CONFIRM_ON_DELETE_COLUMN) {
                                        setGeneralState({
                                            columnToEdit: {
                                                columnIndex: index,
                                                name,
                                            },
                                        })
                                        setModalState({
                                            action: MODAL_ACTION.OPEN,
                                            target: MODALS.DELETE_COLUMN_CONFIRMATION,
                                        })
                                    } else {
                                        deleteColumn(index)
                                    }
                                }}
                                stackCardsMode={settings.STACK_MODE}
                                baseWidth={baseWidth}
                                deckBoard={deckBoard}
                                draggedCard={draggedCard}
                                zoomFactor={zoomFactor}
                                onAddClick={addCard}
                                onRemoveClick={removeCard}
                                setModalState={setModalState}
                                setGeneralState={setGeneralState}
                            />
                            <Box position={'fixed'} bottom={20} right={20} width={200} zIndex={100001}>
                                <Slider
                                    defaultValue={initialZoomFactor}
                                    onChangeCommitted={(_, v) => setZoomFactor(typeof v === 'number' ? v : v[0])}
                                    min={0.2}
                                    max={1}
                                    step={0.025}
                                />
                            </Box>
                        </Box>
                    </Fade>
                </DragDropContext>
                <Box position={'fixed'} top={0} left={0} right={0} bottom={0} zIndex={0} bgcolor={colors.midGray} />
            </Box>
            <Modals.DeckImporterModal
                open={modals.IMPORT_DECK}
                setModalState={setModalState}
                deckImportRef={textFieldRef}
                setDeck={setImportedDeck}
            />
            <Modals.LoadingModal open={modals.LOADING} message={loadingMessage} />
            <Modals.NewColumnModal
                open={modals.NEW_COLUMN}
                setModalState={setModalState}
                createColumn={createColumn}
                newColumnRef={textFieldRef}
            />
            <Modals.DeleteCardConfirmationModal
                confirmDeleteCard={() => (cardToDelete ? removeCard(cardToDelete) : console.log('NOTHING'))}
                open={modals.DELETE_CARD_CONFIRMATION}
                setModalState={setModalState}
            />
            <Modals.EditColumnModal
                columnToEdit={columnToEdit}
                open={modals.EDIT_COLUMN}
                setModalState={setModalState}
                editColumn={handleEditColumn}
                editColumnRef={textFieldRef}
            />
            <Modals.DeleteColumnConfirmationModal
                confirmDeleteColumn={() =>
                    columnToEdit ? deleteColumn(columnToEdit.columnIndex) : console.log('NOTHING')
                }
                open={modals.DELETE_COLUMN_CONFIRMATION}
                setModalState={setModalState}
            />
            <Modals.CardDetailsModal open={modals.CARD_DETAILS} card={selectedCard} setModalState={setModalState} />
        </>
    )
}

export default FirstPage
