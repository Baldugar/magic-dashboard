import {
    Button,
    ClickAwayListener,
    FormControlLabel,
    Grow,
    IconButton,
    MenuList,
    Paper,
    Popper,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { KeyboardEvent, SyntheticEvent, useRef, useState } from 'react'
import colors from 'utils/colors'
import SettingsIcon from '@mui/icons-material/Settings'
import { GeneralState } from 'store/GeneralState/GeneralState.reducer'
import { MODAL_ACTION, MODALS, SETTINGS, DeckBoard } from 'utils/types'
import { Download } from '@mui/icons-material'

export interface HeaderProps {
    setModalState: (payload: { action: MODAL_ACTION; target: MODALS; message?: string }) => void
    setSettings: (payload: { setting: SETTINGS; value: boolean }) => void
    generalState: GeneralState
    deckBoard: DeckBoard
    exportCurrentDeckBoard: () => void
}

const Header = (props: HeaderProps): JSX.Element => {
    const { setModalState, deckBoard, generalState, setSettings, exportCurrentDeckBoard } = props
    const { settings } = generalState
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLButtonElement>(null)

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

    const handleOpenImportModal = () => setModalState({ action: MODAL_ACTION.OPEN, target: MODALS.IMPORT_DECK })
    const handleOpenNewColumnModal = () => setModalState({ action: MODAL_ACTION.OPEN, target: MODALS.NEW_COLUMN })

    return (
        <Box
            position={'fixed'}
            top={0}
            left={0}
            right={0}
            height={'50px'}
            bgcolor={colors.black}
            pl={3}
            pr={3}
            zIndex={1000}
        >
            <Box
                position={'relative'}
                flex={1}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                height={1}
            >
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                    <Button onClick={handleOpenImportModal} color={'secondary'}>
                        Import Deck
                    </Button>
                    <Button onClick={handleOpenNewColumnModal} color={'secondary'}>
                        Add column
                    </Button>
                </Box>
                <Box display={'flex'} style={{ columnGap: 16 }}>
                    <Tooltip title={'Download current deck'}>
                        <IconButton onClick={exportCurrentDeckBoard} color={'primary'}>
                            <Download />
                        </IconButton>
                    </Tooltip>
                    <IconButton ref={anchorRef} onClick={handleToggle} color={'primary'}>
                        <SettingsIcon />
                    </IconButton>
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
                                                maxWidth: '25vw',
                                                minWidth: '260px',
                                                rowGap: '10px',
                                            }}
                                        >
                                            <FormControlLabel
                                                checked={settings.STACK_MODE}
                                                onChange={() => {
                                                    setSettings({
                                                        setting: SETTINGS.STACK_MODE,
                                                        value: !settings.STACK_MODE,
                                                    })
                                                }}
                                                control={<Switch />}
                                                label="Stack Mode"
                                                sx={{ marginLeft: 0 }}
                                            />
                                            <FormControlLabel
                                                checked={settings.DELETE_CARDS_ON_DELETE_COLUMN}
                                                onChange={() => {
                                                    setSettings({
                                                        setting: SETTINGS.DELETE_CARDS_ON_DELETE_COLUMN,
                                                        value: !settings.DELETE_CARDS_ON_DELETE_COLUMN,
                                                    })
                                                }}
                                                control={<Switch />}
                                                label={
                                                    'Delete cards on delete column (If off, all orphan cards will be put in the next/previous column)'
                                                }
                                                sx={{ marginLeft: 0 }}
                                            />
                                            <FormControlLabel
                                                checked={settings.CONFIRM_ON_DELETE_CARD}
                                                onChange={() => {
                                                    setSettings({
                                                        setting: SETTINGS.CONFIRM_ON_DELETE_CARD,
                                                        value: !settings.CONFIRM_ON_DELETE_CARD,
                                                    })
                                                }}
                                                control={<Switch />}
                                                label={'Show confirmation dialog when removing last card of a type'}
                                                sx={{ marginLeft: 0 }}
                                            />
                                            <FormControlLabel
                                                checked={settings.CONFIRM_ON_DELETE_COLUMN}
                                                onChange={() => {
                                                    setSettings({
                                                        setting: SETTINGS.CONFIRM_ON_DELETE_COLUMN,
                                                        value: !settings.CONFIRM_ON_DELETE_COLUMN,
                                                    })
                                                }}
                                                control={<Switch />}
                                                label={'Show confirmation dialog when removing a column'}
                                                sx={{ marginLeft: 0 }}
                                            />
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
                <Box
                    position={'absolute'}
                    top={0}
                    height={50}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    left={'50%'}
                    style={{ transform: 'translateX(-50%)' }}
                >
                    <Typography color={'primary'} variant={'h4'}>
                        {`${deckBoard.columns.reduce(
                            (prev, curr) => prev + curr.cards.reduce((prev2, curr2) => prev2 + curr2.numOfCards, 0),
                            0,
                        )} cards in deck`}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Header
