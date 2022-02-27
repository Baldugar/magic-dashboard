import { Button, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Box } from '@mui/system'
import { isEqual } from 'lodash'
import CMCSelector from 'pages/Catalogue/components/CMCSelector'
import ExpansionSelector from 'pages/Catalogue/components/ExpansionSelector'
import ManaSelector from 'pages/Catalogue/components/ManaSelector'
import RaritySelector from 'pages/Catalogue/components/RaritySelector'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import TypeSelector from 'pages/Catalogue/components/TypeSelector'
import React, { useEffect, useMemo, useState } from 'react'
import { CatalogueFilterType } from 'store/CatalogueState/CatalogueState.reducer'
import { calculateExpansions, calculateSubtypes, filterCardType, getCardTypeFromString } from 'utils/funcs'
import { isNegativeTB, isNotUnsetTB, isPositiveTB, nextTB, TernaryBoolean } from 'utils/ternaryBoolean'
import { CARD_TYPES, MTGACard } from 'utils/types'

export interface CatalogueFilterModalProps {
    visible: boolean
    onClose: () => void
    onConfirm: (filter: CatalogueFilterType) => void
    currentFilter: CatalogueFilterType
    cards: MTGACard[]
}

const CatalogueFilterModal = (props: CatalogueFilterModalProps): JSX.Element => {
    const { currentFilter, onClose, onConfirm, visible, cards } = props

    const [filter, setFilter] = useState<CatalogueFilterType>({ ...currentFilter })
    const [possibleSubtypes, setPossibleSubtypes] = useState<{ [key in CARD_TYPES]: string[] }>({
        ARTIFACT: [],
        CREATURE: [],
        ENCHANTMENT: [],
        INSTANT: [],
        LAND: [],
        PLANESWALKER: [],
        SORCERY: [],
        // COMMANDERS: [],
    })
    const [selectedSubtypeTab, setSelectedSubtypeTab] = useState<CARD_TYPES>()

    useEffect(() => {
        const possSubtypes = { ...possibleSubtypes }
        const newFilter = { ...currentFilter }
        if (isPositiveTB(filter.cardTypes.ARTIFACT)) {
            possSubtypes.ARTIFACT = calculateSubtypes(filterCardType(cards, CARD_TYPES.ARTIFACT))
        } else {
            possSubtypes.ARTIFACT = []
            if (Object.values(newFilter.subtype.ARTIFACT).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.ARTIFACT = {}
            }
        }
        if (isPositiveTB(filter.cardTypes.CREATURE)) {
            possSubtypes.CREATURE = calculateSubtypes(filterCardType(cards, CARD_TYPES.CREATURE))
        } else {
            possSubtypes.CREATURE = []
            if (Object.values(newFilter.subtype.CREATURE).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.CREATURE = {}
            }
        }
        if (isPositiveTB(filter.cardTypes.ENCHANTMENT)) {
            possSubtypes.ENCHANTMENT = calculateSubtypes(filterCardType(cards, CARD_TYPES.ENCHANTMENT))
        } else {
            possSubtypes.ENCHANTMENT = []
            if (Object.values(newFilter.subtype.ENCHANTMENT).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.ENCHANTMENT = {}
            }
        }
        if (isPositiveTB(filter.cardTypes.INSTANT)) {
            possSubtypes.INSTANT = calculateSubtypes(filterCardType(cards, CARD_TYPES.INSTANT))
        } else {
            possSubtypes.INSTANT = []
            if (Object.values(newFilter.subtype.INSTANT).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.INSTANT = {}
            }
        }
        if (isPositiveTB(filter.cardTypes.LAND)) {
            possSubtypes.LAND = calculateSubtypes(filterCardType(cards, CARD_TYPES.LAND))
        } else {
            possSubtypes.LAND = []
            if (Object.values(newFilter.subtype.LAND).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.LAND = {}
            }
        }
        if (isPositiveTB(filter.cardTypes.PLANESWALKER)) {
            possSubtypes.PLANESWALKER = calculateSubtypes(filterCardType(cards, CARD_TYPES.PLANESWALKER))
        } else {
            possSubtypes.PLANESWALKER = []
            if (Object.values(newFilter.subtype.PLANESWALKER).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.PLANESWALKER = {}
            }
        }
        if (isPositiveTB(filter.cardTypes.SORCERY)) {
            possSubtypes.SORCERY = calculateSubtypes(filterCardType(cards, CARD_TYPES.SORCERY))
        } else {
            possSubtypes.SORCERY = []
            if (Object.values(newFilter.subtype.SORCERY).some((value) => isNotUnsetTB(value))) {
                newFilter.subtype.SORCERY = {}
            }
        }
        setPossibleSubtypes(possSubtypes)
        if (!isEqual(newFilter, currentFilter)) {
            setFilter(newFilter)
        }
    }, [filter])

    useEffect(() => {
        if (selectedSubtypeTab === undefined) {
            if (filter.cardTypes.SORCERY) {
                setSelectedSubtypeTab(CARD_TYPES.SORCERY)
            }
            if (filter.cardTypes.PLANESWALKER) {
                setSelectedSubtypeTab(CARD_TYPES.PLANESWALKER)
            }
            if (filter.cardTypes.LAND) {
                setSelectedSubtypeTab(CARD_TYPES.LAND)
            }
            if (filter.cardTypes.INSTANT) {
                setSelectedSubtypeTab(CARD_TYPES.INSTANT)
            }
            if (filter.cardTypes.ENCHANTMENT) {
                setSelectedSubtypeTab(CARD_TYPES.ENCHANTMENT)
            }
            if (filter.cardTypes.CREATURE) {
                setSelectedSubtypeTab(CARD_TYPES.CREATURE)
            }
            if (filter.cardTypes.ARTIFACT) {
                setSelectedSubtypeTab(CARD_TYPES.ARTIFACT)
            }
        } else {
            let newSelectedSubtypeTab: CARD_TYPES | undefined = undefined
            if (filter.cardTypes.SORCERY) {
                newSelectedSubtypeTab = CARD_TYPES.SORCERY
            }
            if (filter.cardTypes.PLANESWALKER) {
                newSelectedSubtypeTab = CARD_TYPES.PLANESWALKER
            }
            if (filter.cardTypes.LAND) {
                newSelectedSubtypeTab = CARD_TYPES.LAND
            }
            if (filter.cardTypes.INSTANT) {
                newSelectedSubtypeTab = CARD_TYPES.INSTANT
            }
            if (filter.cardTypes.ENCHANTMENT) {
                newSelectedSubtypeTab = CARD_TYPES.ENCHANTMENT
            }
            if (filter.cardTypes.CREATURE) {
                newSelectedSubtypeTab = CARD_TYPES.CREATURE
            }
            if (filter.cardTypes.ARTIFACT) {
                newSelectedSubtypeTab = CARD_TYPES.ARTIFACT
            }
            setSelectedSubtypeTab(newSelectedSubtypeTab)
        }
    }, [filter])

    useEffect(() => {
        if (visible) {
            setFilter(currentFilter)
        }
    }, [visible])

    const expansions = useMemo(() => calculateExpansions(cards), [cards])

    return (
        <Modal open={visible} onBackdropClick={onClose} onClose={onClose}>
            <Box bgcolor="teal" display={'flex'} flexDirection={'column'} maxHeight={'100vh'}>
                {/* UP ROW */}
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                    <Box display={'flex'}>
                        <ManaSelector
                            selected={{ ...filter.color }}
                            setSelected={(c) => {
                                const newFilter = { ...filter }
                                newFilter.color[c] = nextTB(newFilter.color[c])
                                setFilter(newFilter)
                            }}
                            multi={{
                                value: filter.multiColor,
                                selectMulti: () => {
                                    const newFilter = { ...filter }
                                    newFilter.multiColor = nextTB(newFilter.multiColor)
                                    setFilter(newFilter)
                                },
                            }}
                        />
                    </Box>
                    <Box display={'flex'}>
                        <CMCSelector
                            selected={{ ...filter.manaCosts }}
                            setSelected={(c) => {
                                const newFilter = { ...filter }
                                newFilter.manaCosts[c] = nextTB(newFilter.manaCosts[c])
                                setFilter(newFilter)
                            }}
                        />
                    </Box>
                </Box>
                {/* MAIN CONTENT */}
                <Box display={'flex'} flexDirection={'row'} flex={1} maxHeight={'calc(100vh - 50px)'}>
                    {/* LEFT COLUMN */}
                    <Box display={'flex'} flexDirection={'column'}>
                        {/* RARITY */}
                        <Box display={'flex'} flexDirection={'row'}>
                            <RaritySelector
                                selected={filter.rarity}
                                setSelected={(r) => {
                                    const newFilter = { ...filter }
                                    newFilter.rarity[r] = nextTB(newFilter.rarity[r])
                                    setFilter(newFilter)
                                }}
                            />
                        </Box>
                        {/* OR/AND */}
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
                            <ToggleButtonGroup
                                color="secondary"
                                value={filter.andOr}
                                exclusive
                                onChange={(_, v) => {
                                    if (v !== null) {
                                        const newFilter = { ...filter }
                                        newFilter.andOr = v as 'and' | 'or'
                                        setFilter(newFilter)
                                    }
                                }}
                            >
                                <ToggleButton value="and">AND</ToggleButton>
                                <ToggleButton value="or">OR</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        {/* TIPOS */}
                        <Box display={'flex'} flexDirection={'column'}>
                            <TypeSelector
                                selected={filter.cardTypes}
                                setSelected={(t) => {
                                    const newFilter = { ...filter }
                                    newFilter.cardTypes[t] = nextTB(newFilter.cardTypes[t])
                                    setFilter(newFilter)
                                }}
                            />
                        </Box>
                        {/* EDICIONES */}
                        <Box display={'flex'} flexDirection={'column'} maxWidth={600} style={{ overflowY: 'auto' }}>
                            <ExpansionSelector
                                selected={filter.expansions}
                                setSelected={(e) => {
                                    const newFilter = { ...filter }
                                    if (isNotUnsetTB(newFilter.expansions[e])) {
                                        newFilter.expansions[e] = nextTB(newFilter.expansions[e])
                                    } else {
                                        newFilter.expansions[e] = TernaryBoolean.TRUE
                                    }
                                    setFilter(newFilter)
                                }}
                                expansions={expansions}
                            />
                        </Box>
                    </Box>
                    {/* MAIN COLUMN */}
                    <Box display={'flex'} flexDirection={'column'} flex={1}>
                        {/* MAIN CONTENT */}
                        <Box display={'flex'} flexDirection={'column'} flex={1} overflow={'hidden'}>
                            {/* TABS */}
                            <Box
                                display={'flex'}
                                flexDirection={'row'}
                                columnGap={3}
                                paddingY={2}
                                paddingX={3}
                                style={{ overflowX: 'auto', overflowY: 'hidden' }}
                            >
                                {Object.entries(possibleSubtypes)
                                    .filter(([_, v]) => v.length > 0)
                                    .map(([k]) => {
                                        return (
                                            <Button
                                                variant={'contained'}
                                                key={k + selectedSubtypeTab}
                                                onClick={() => {
                                                    setSelectedSubtypeTab(getCardTypeFromString(k))
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '4px 8px',
                                                    border: '1px solid black',
                                                    backgroundColor:
                                                        selectedSubtypeTab &&
                                                        selectedSubtypeTab === getCardTypeFromString(k)
                                                            ? 'pink'
                                                            : 'white',
                                                }}
                                            >
                                                {k}
                                            </Button>
                                        )
                                    })}
                            </Box>
                            {/* SUBTYPES */}
                            <Box
                                display={'flex'}
                                flexDirection={'row'}
                                alignContent={'flex-start'}
                                flexWrap={'wrap'}
                                paddingY={2}
                                paddingX={3}
                                flex={1}
                                columnGap={1.5}
                                rowGap={1}
                                style={{ overflowY: 'auto' }}
                            >
                                {selectedSubtypeTab &&
                                    possibleSubtypes[selectedSubtypeTab].map((s, i) => (
                                        <TernaryToggle
                                            type="chip"
                                            value={filter.subtype[selectedSubtypeTab][s]}
                                            chipProps={{
                                                label: s,
                                                onClick: () => {
                                                    const newFilter = { ...filter }

                                                    if (newFilter.subtype[selectedSubtypeTab][s]) {
                                                        newFilter.subtype[selectedSubtypeTab][s] = nextTB(
                                                            newFilter.subtype[selectedSubtypeTab][s],
                                                        )
                                                    } else {
                                                        newFilter.subtype[selectedSubtypeTab][s] = TernaryBoolean.TRUE
                                                    }
                                                    setFilter(newFilter)
                                                },
                                                style: {
                                                    backgroundColor: isPositiveTB(filter.subtype[selectedSubtypeTab][s])
                                                        ? 'green'
                                                        : isNegativeTB(filter.subtype[selectedSubtypeTab][s])
                                                        ? 'red'
                                                        : 'white',
                                                },
                                                className: `${s + i + (filter.subtype[selectedSubtypeTab][s] ? 1 : 0)}`,
                                            }}
                                            key={`${s + i + (filter.subtype[selectedSubtypeTab][s] ? 1 : 0)}`}
                                        />
                                    ))}
                            </Box>
                        </Box>
                        {/* BUTTONS */}
                        <Box display={'flex'} flexDirection={'column'} alignItems={'flex-end'}>
                            <Box>
                                <Button variant={'contained'}>RESET</Button>
                            </Box>
                            <Box>
                                <Button variant={'contained'} onClick={() => onConfirm(filter)}>
                                    CONFIRM
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}

export default CatalogueFilterModal
