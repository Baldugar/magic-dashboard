import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, ButtonBase, Divider, Rating, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { CategoryType, Color, Tag } from 'graphql/types'
import { CSSProperties } from 'react'
import { calculateColor } from 'utils/funcs'

export interface CardModalCategoryPill {
    category: Tag
    onClick?: () => void
    selected?: boolean
    rating: number
    comment: string
    disabled?: boolean
}

const CardModalCategoryPill = (props: CardModalCategoryPill): JSX.Element => {
    const { category, onClick, selected, rating, comment, disabled } = props
    const { type, colors, categoryType, extra } = category
    const chipColor = calculateColor(colors)

    const boxStyle: CSSProperties = {
        width: '100%',
        border: selected ? '1px solid black' : undefined,
        display: 'flex',
        flexDirection: 'column',
        rowGap: '8px',
        paddingBottom: '8px',
    }
    if (chipColor.background) {
        boxStyle.background = chipColor.background
    } else if (chipColor.gradient) {
        boxStyle.backgroundImage = `linear-gradient(to right, ${chipColor.gradient.left}, ${chipColor.gradient.right})`
    }
    return (
        <>
            <ButtonBase disabled={disabled} style={{ width: '100%', marginTop: 16 }} onClick={onClick}>
                <Box style={boxStyle}>
                    <Box display={'flex'} columnGap={0.5} alignItems={'center'} paddingLeft={'12px'} paddingTop={'8px'}>
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
                        {Object.values(Color)
                            .filter((c) => colors.includes(c))
                            .map((c) => (
                                <img key={c} src={`/img/mana/${c}.svg`} width={20} height={20} />
                            ))}
                    </Box>
                    <Divider />
                    <Typography variant={'body2'}>{`${type}${extra.length > 0 ? ` - ${extra}` : ''}`}</Typography>
                    <Rating value={rating} readOnly style={{ paddingLeft: '12px' }} />
                </Box>
            </ButtonBase>
            {comment.length > 0 && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>Comment</AccordionSummary>
                    <AccordionDetails>{comment}</AccordionDetails>
                </Accordion>
            )}
        </>
    )
}

export default CardModalCategoryPill
