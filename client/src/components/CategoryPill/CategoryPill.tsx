import { Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import colors from 'utils/colors'
import { CardCategory, COLORS } from 'utils/types'

export interface CategoryPillProps {
    category: CardCategory
    onClick?: () => void
    onDeleteClick?: () => void
    selected?: boolean
}

const calculateColor = (
    c: COLORS[],
): { background?: string; gradient?: { left: string; right: string }; foreground: string } => {
    if (c.length === 1) {
        switch (c[0]) {
            case COLORS.BLACK:
                return colors.cardPills.one_color.black
            case COLORS.WHITE:
                return colors.cardPills.one_color.white
            case COLORS.RED:
                return colors.cardPills.one_color.red
            case COLORS.GREEN:
                return colors.cardPills.one_color.green
            case COLORS.BLUE:
                return colors.cardPills.one_color.blue
            case COLORS.COLORLESS:
                return colors.cardPills.one_color.colorless
        }
    }
    if (c.length === 2) {
        if (c.includes(COLORS.COLORLESS)) {
            switch (c[c.findIndex((co) => co !== COLORS.COLORLESS)]) {
                case COLORS.BLACK:
                    return colors.cardPills.one_color.black
                case COLORS.WHITE:
                    return colors.cardPills.one_color.white
                case COLORS.RED:
                    return colors.cardPills.one_color.red
                case COLORS.GREEN:
                    return colors.cardPills.one_color.green
                case COLORS.BLUE:
                    return colors.cardPills.one_color.blue
                case COLORS.COLORLESS:
                    return colors.cardPills.one_color.colorless
            }
        } else {
            const colorMap: Record<
                COLORS,
                Record<COLORS, { left?: string; right?: string; foreground?: string; background?: string }>
            > = {
                [COLORS.BLACK]: {
                    [COLORS.BLUE]: colors.cardPills.two_colors.dimir,
                    [COLORS.GREEN]: colors.cardPills.two_colors.golgari,
                    [COLORS.RED]: colors.cardPills.two_colors.rakdos,
                    [COLORS.WHITE]: colors.cardPills.two_colors.orzhov,
                    [COLORS.COLORLESS]: colors.cardPills.one_color.black,
                    [COLORS.BLACK]: colors.cardPills.one_color.black,
                },
                [COLORS.BLUE]: {
                    [COLORS.BLACK]: colors.cardPills.two_colors.dimir,
                    [COLORS.GREEN]: colors.cardPills.two_colors.simic,
                    [COLORS.RED]: colors.cardPills.two_colors.izzet,
                    [COLORS.WHITE]: colors.cardPills.two_colors.azorius,
                    [COLORS.COLORLESS]: colors.cardPills.one_color.blue,
                    [COLORS.BLUE]: colors.cardPills.one_color.blue,
                },
                [COLORS.GREEN]: {
                    [COLORS.BLACK]: colors.cardPills.two_colors.golgari,
                    [COLORS.BLUE]: colors.cardPills.two_colors.simic,
                    [COLORS.RED]: colors.cardPills.two_colors.gruul,
                    [COLORS.WHITE]: colors.cardPills.two_colors.selesnya,
                    [COLORS.COLORLESS]: colors.cardPills.one_color.green,
                    [COLORS.GREEN]: colors.cardPills.one_color.green,
                },
                [COLORS.RED]: {
                    [COLORS.BLACK]: colors.cardPills.two_colors.rakdos,
                    [COLORS.BLUE]: colors.cardPills.two_colors.izzet,
                    [COLORS.GREEN]: colors.cardPills.two_colors.gruul,
                    [COLORS.WHITE]: colors.cardPills.two_colors.boros,
                    [COLORS.COLORLESS]: colors.cardPills.one_color.red,
                    [COLORS.RED]: colors.cardPills.one_color.red,
                },
                [COLORS.WHITE]: {
                    [COLORS.BLACK]: colors.cardPills.two_colors.orzhov,
                    [COLORS.BLUE]: colors.cardPills.two_colors.azorius,
                    [COLORS.GREEN]: colors.cardPills.two_colors.selesnya,
                    [COLORS.RED]: colors.cardPills.two_colors.boros,
                    [COLORS.COLORLESS]: colors.cardPills.one_color.white,
                    [COLORS.WHITE]: colors.cardPills.one_color.white,
                },
                [COLORS.COLORLESS]: {
                    [COLORS.BLACK]: colors.cardPills.one_color.black,
                    [COLORS.BLUE]: colors.cardPills.one_color.blue,
                    [COLORS.GREEN]: colors.cardPills.one_color.green,
                    [COLORS.RED]: colors.cardPills.one_color.red,
                    [COLORS.WHITE]: colors.cardPills.one_color.white,
                    [COLORS.COLORLESS]: colors.cardPills.one_color.colorless,
                },
            }
            const color = colorMap[c[0]][c[1]]
            const toReturn: { background?: string; gradient?: { left: string; right: string }; foreground: string } = {
                foreground: colors.cardPills.two_colors.foreground,
            }
            if (color.background) {
                toReturn.background = color.background
            } else if (color.left && color.right) {
                toReturn.gradient = { left: color.left, right: color.right }
            }
            return { ...toReturn }
        }
    }
    return {
        background: colors.cardPills.multi_colors.background,
        foreground: colors.cardPills.multi_colors.foreground,
    }
}

const CategoryPill = (props: CategoryPillProps): JSX.Element => {
    const { category, onClick, onDeleteClick, selected } = props
    const { name, colors } = category
    const chipColor = calculateColor(colors)

    const chipStyle: any = {
        '& .MuiChip-label': {
            flex: 1,
            paddingLeft: '8px',
            paddingRight: '8px',
        },
        borderRadius: '17px',
        height: '48px',
        minHeight: '48px',
        border: selected ? '1px solid black' : undefined,
    }
    if (chipColor.background) {
        chipStyle.background = chipColor.background
    } else if (chipColor.gradient) {
        chipStyle.backgroundImage = `linear-gradient(to right, ${chipColor.gradient.left}, ${chipColor.gradient.right})`
    }
    return (
        <Chip
            label={
                <Box display={'flex'} flex={1}>
                    <Box
                        flex={1}
                        height={'32px'}
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        paddingX={'10px'}
                        borderRadius={'8px'}
                        border={'1px solid black'}
                        bgcolor={chipColor.foreground}
                        // zIndex={2000}
                    >
                        <Box display={'flex'}>
                            {Object.values(COLORS)
                                .filter((c) => colors.includes(c))
                                .map((c) => (
                                    <img key={c} src={`/img/mana/${c}.svg`} width={20} height={20} />
                                ))}
                        </Box>
                        <Box>
                            <Typography>{name}</Typography>
                        </Box>
                    </Box>
                </Box>
            }
            onClick={onClick}
            onDelete={onDeleteClick}
            sx={chipStyle}
        />
    )
}

export default CategoryPill
