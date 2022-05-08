import { Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { CategoryType, Color, Tag } from 'graphql/types'
import { calculateColor } from 'utils/funcs'

export interface CategoryPillProps {
    category: Tag
    onClick?: () => void
    onContextMenu?: () => void
    onDeleteClick?: () => void
    selected?: boolean
    disabled?: boolean
}

const CategoryPill = (props: CategoryPillProps): JSX.Element => {
    const { category, onClick, onDeleteClick, onContextMenu, selected, disabled } = props
    const { type, colors, categoryType, extra } = category
    const chipColor = calculateColor(colors)

    const chipStyle: any = {
        '& .MuiChip-label': {
            flex: 1,
            paddingLeft: '8px',
            paddingRight: '8px',
        },
        borderRadius: '17px',
        height: '52px',
        minHeight: '52px',
        width: '100%',
        maxWidth: '600px',
        border: selected ? '1px solid black' : undefined,
    }
    if (chipColor.background) {
        chipStyle.background = chipColor.background
    } else if (chipColor.gradient) {
        chipStyle.backgroundImage = `linear-gradient(to right, ${chipColor.gradient.left}, ${chipColor.gradient.right})`
    }
    return (
        <Chip
            disabled={disabled}
            label={
                <Box display={'flex'} flex={1} overflow={'hidden'}>
                    <Box
                        flex={1}
                        height={'36px'}
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems={'center'}
                        paddingX={'10px'}
                        borderRadius={'8px'}
                        border={'1px solid black'}
                        bgcolor={chipColor.foreground}
                        overflow={'hidden'}
                        columnGap={'4px'}
                    >
                        <Box
                            display={'flex'}
                            width={'28px'}
                            height={'28px'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            bgcolor={'white'}
                            border={'1px solid black'}
                            borderRadius={'50%'}
                        >
                            <img
                                src={`/img/category/${categoryType === CategoryType.CARD ? 'card' : 'deck'}Icon.png`}
                                style={{ maxWidth: '22px', maxHeight: '22px' }}
                            />
                        </Box>
                        <Box display={'flex'}>
                            {Object.values(Color)
                                .filter((c) => colors.includes(c))
                                .map((c) => (
                                    <img key={c} src={`/img/mana/${c}.svg`} width={20} height={20} />
                                ))}
                        </Box>
                        <Box marginLeft={'auto'} paddingLeft={2} overflow={'hidden'}>
                            <Typography style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{`${type}${
                                extra.length > 0 ? ` - ${extra}` : ''
                            }`}</Typography>
                        </Box>
                    </Box>
                </Box>
            }
            onClick={onClick}
            onDelete={onDeleteClick}
            onContextMenu={
                onContextMenu
                    ? (e) => {
                          e.preventDefault()
                          onContextMenu()
                      }
                    : undefined
            }
            sx={chipStyle}
        />
    )
}

export default CategoryPill
