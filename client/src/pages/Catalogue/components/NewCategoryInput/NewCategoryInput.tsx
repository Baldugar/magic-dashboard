import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
    IconButton,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material'
import { CategoryType, Color, Tag } from 'graphql/types'
import { sortBy, uniqBy } from 'lodash'
import { useMemo, useState } from 'react'

export interface NewCategoryInputProps {
    cardCategories: Tag[]
    deckCategories: Tag[]
    onSubmit: (type: string, extra: string, colors: Color[], categoryType: CategoryType) => void
}

export const NewCategoryInput = (props: NewCategoryInputProps) => {
    const { onSubmit, cardCategories, deckCategories } = props

    const [type, setType] = useState<{ type: string; inputValue?: string } | null>(null)
    const [extra, setExtra] = useState('')
    const [colors, setColors] = useState<Color[]>([])
    const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.CARD)

    const possibleCategoryNames: { type: string; inputValue?: string }[] = useMemo(
        () =>
            categoryType === CategoryType.CARD
                ? sortBy(
                      uniqBy(
                          cardCategories.map((c) => ({
                              type: c.type,
                              inputValue: undefined,
                          })),
                          'type',
                      ),
                      'type',
                  )
                : sortBy(
                      uniqBy(
                          deckCategories.map((c) => ({ type: c.type, inputValue: undefined })),
                          'type',
                      ),
                      'type',
                  ),
        [categoryType],
    )

    const addColor = (color: Color) => {
        setColors([...colors, color])
    }

    const removeColor = (color: Color) => {
        setColors(colors.filter((c) => c !== color))
    }

    const handleCategoryType = (_: any, newCategoryType: CategoryType | null) => {
        if (newCategoryType) {
            setCategoryType(newCategoryType)
        }
    }

    const filter = createFilterOptions<{ type: string; inputValue?: string }>()

    const tagAlreadyExists = (
        type: { type: string; inputValue?: string } | null,
        extra: string,
        colors: Color[],
        categoryType: CategoryType,
    ): boolean => {
        let exists = false
        const typeToCheck = type ? type.type ?? type.inputValue ?? '' : ''
        if (categoryType === CategoryType.CARD) {
            exists = cardCategories.some((c) => {
                const tagColors = colors
                const cColors = c.colors
                return (
                    c.type === typeToCheck &&
                    c.extra === extra &&
                    cColors.length === tagColors.length &&
                    cColors.every((c) => tagColors.includes(c))
                )
            })
        }
        if (categoryType === CategoryType.DECK) {
            exists = deckCategories.some((c) => {
                const tagColors = colors
                const cColors = c.colors
                console.log(
                    tagColors,
                    cColors,
                    cColors.length === tagColors.length && cColors.every((c) => tagColors.includes(c)),
                )
                return (
                    c.type === typeToCheck &&
                    c.extra === extra &&
                    cColors.length === tagColors.length &&
                    cColors.every((c) => tagColors.includes(c))
                )
            })
        }
        return exists
    }

    return (
        <Box display={'flex'} flexDirection={'column'} rowGap={1} padding={2}>
            <Box display={'flex'} columnGap={1}>
                <Box flex={8}>
                    {/* <TextField label={'Type'} fullWidth value={type} onChange={(e) => setType(e.target.value)} /> */}

                    <Autocomplete
                        value={type}
                        onChange={(_, newValue) => {
                            if (typeof newValue === 'string') {
                                setType({
                                    type: newValue,
                                })
                            } else if (newValue && newValue.inputValue) {
                                // Create a new value from the user input
                                setType({
                                    type: newValue.inputValue,
                                })
                            } else {
                                setType(newValue)
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params)

                            const { inputValue } = params
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue === option.type)
                            if (inputValue !== '' && !isExisting) {
                                filtered.push({
                                    inputValue,
                                    type: `Add "${inputValue}"`,
                                })
                            }

                            return filtered
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={possibleCategoryNames}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue
                            }
                            // Regular option
                            return option.type
                        }}
                        renderOption={(props, option) => <li {...props}>{option.type}</li>}
                        sx={{ width: 300 }}
                        freeSolo
                        renderInput={(params) => <TextField {...params} label="Type" autoFocus />}
                    />
                </Box>
                <Box flex={4}>
                    <TextField label={'Extra'} fullWidth value={extra} onChange={(e) => setExtra(e.target.value)} />
                </Box>
            </Box>
            <Box display={'flex'} columnGap={1}>
                {Object.values(Color).map((c) => (
                    <Box key={c} display={'flex'} alignItems={'center'}>
                        <IconButton
                            size={'small'}
                            onClick={() => {
                                if (colors.includes(c)) {
                                    removeColor(c)
                                } else {
                                    addColor(c)
                                }
                            }}
                        >
                            <img
                                src={`/img/mana/${c}.svg`}
                                width={30}
                                height={30}
                                style={{ opacity: colors.includes(c) ? 1 : 0.3, transition: 'opacity 250ms' }}
                            />
                        </IconButton>
                    </Box>
                ))}
            </Box>
            <Box>
                <ToggleButtonGroup
                    value={categoryType}
                    exclusive
                    onChange={handleCategoryType}
                    aria-label="text alignment"
                >
                    <ToggleButton value="CARD" aria-label="left aligned">
                        Card
                    </ToggleButton>
                    <ToggleButton value="DECK" aria-label="left aligned">
                        Deck
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box display={'flex'} columnGap={1}>
                <Box>
                    <Button
                        disabled={
                            type === null || colors.length === 0 || tagAlreadyExists(type, extra, colors, categoryType)
                        }
                        variant={'contained'}
                        onClick={() => {
                            onSubmit(type?.inputValue ?? type?.type ?? '', extra, colors, categoryType)
                        }}
                    >
                        Submit
                    </Button>
                </Box>
                <Box>
                    <Button
                        color={'secondary'}
                        variant={'contained'}
                        onClick={() => {
                            setType(null)
                            setExtra('')
                            setColors([])
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
