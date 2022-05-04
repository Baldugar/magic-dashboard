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
import { Color, UserTag } from 'graphql/types'
import { useState } from 'react'

export interface NewCategoryInputProps {
    cardCategories: UserTag[]
    deckCategories: UserTag[]
    onSubmit: (type: string, extra: string, comment: string, colors: Color[], categoryType: 'CARD' | 'DECK') => void
}

export const NewCategoryInput = (props: NewCategoryInputProps) => {
    const { onSubmit, cardCategories, deckCategories } = props
    const [type, setType] = useState<{ type: string; inputValue?: string } | null>(null)
    const [extra, setExtra] = useState('')
    const [comment, setComment] = useState('')
    const [colors, setColors] = useState<Color[]>([])
    const [categoryType, setCategoryType] = useState<'CARD' | 'DECK'>('CARD')

    const possibleCategoryNames: { type: string; inputValue?: string }[] =
        categoryType === 'CARD'
            ? cardCategories.map((c) => ({
                  type: c.type,
                  inputValue: undefined,
              }))
            : deckCategories.map((c) => ({ type: c.type, inputValue: undefined }))

    const addColor = (color: Color) => {
        setColors([...colors, color])
    }

    const removeColor = (color: Color) => {
        setColors(colors.filter((c) => c !== color))
    }

    const handleCategoryType = (_: any, newCategoryType: 'CARD' | 'DECK' | null) => {
        if (newCategoryType) {
            setCategoryType(newCategoryType)
        }
    }

    const filter = createFilterOptions<{ type: string; inputValue?: string }>()

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
                        renderInput={(params) => <TextField {...params} label="Type" />}
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
                <TextField
                    label={'Comment'}
                    fullWidth
                    value={comment}
                    multiline
                    minRows={2}
                    maxRows={10}
                    onChange={(e) => setComment(e.target.value)}
                />
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
                        disabled={type === null || colors.length === 0}
                        variant={'contained'}
                        onClick={() => {
                            onSubmit(type?.inputValue ?? type?.type ?? '', extra, comment, colors, 'CARD')
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
                            setComment('')
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
