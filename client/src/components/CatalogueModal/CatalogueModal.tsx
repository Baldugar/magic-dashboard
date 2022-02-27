import { Button, Fade, Modal } from '@mui/material'
import { Box } from '@mui/system'
import AddCategory from 'components/AddCategory'
import CategoryPill from 'components/CategoryPill'
import ImageWithSkeleton from 'components/ImageWithSkeleton'
import React, { useEffect, useState } from 'react'
import { CARD_SIZE_VALUES } from 'utils/constants'
import { getCardImages } from 'utils/funcs'
import { CardCategory, CARD_IMAGE_SIZE, MTGACard } from 'utils/types'

export interface CatalogModalProps {
    selectedCard: MTGACard
    onClose: () => void
    categories: CardCategory[]
    addCategoryToDB: (category: CardCategory) => void
    removeCategoryFromDB: (category: CardCategory) => void
    removeCategoryFromCard: (category: CardCategory) => void
    addCategoryToCard: (category: CardCategory) => void
}

const CatalogueModal = (props: CatalogModalProps): JSX.Element | null => {
    const {
        onClose,
        selectedCard: card,
        addCategoryToDB,
        categories,
        removeCategoryFromDB,
        removeCategoryFromCard,
        addCategoryToCard,
    } = props

    const [open, setOpen] = useState<boolean>(true)
    const cardImages = getCardImages(card)
    const [selectedImage, setSelectedImage] = useState(0)
    const animationTime = 100

    useEffect(() => {
        if (open === false) {
            const t = setTimeout(() => onClose(), animationTime)
            return () => clearTimeout(t)
        }
    }, [open])

    console.log(card)

    return (
        <Modal
            open={open}
            onBackdropClick={() => setOpen(false)}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Fade in={open} timeout={animationTime}>
                <Box bgcolor={'rbga(100,100,100,1)'} display={'flex'} flexDirection={'row'} columnGap={'20px'}>
                    <Box bgcolor={'teal'} flex={1} display={'flex'} flexDirection={'column'}>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            flex={1}
                        >
                            {cardImages[selectedImage] && (
                                <ImageWithSkeleton imageSize={CARD_IMAGE_SIZE.NORMAL} img={cardImages[selectedImage]} />
                            )}
                        </Box>
                        {cardImages.length > 1 && (
                            <Box
                                display={'flex'}
                                justifyContent={'stretch'}
                                alignItems={'center'}
                                paddingTop={1}
                                columnGap={'10px'}
                            >
                                {cardImages.map((_, i) => (
                                    <Button
                                        fullWidth
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        variant={'contained'}
                                        color={'primary'}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Box
                        width={CARD_SIZE_VALUES[CARD_IMAGE_SIZE.NORMAL].width}
                        height={CARD_SIZE_VALUES[CARD_IMAGE_SIZE.NORMAL].height}
                        display={'flex'}
                        flexDirection={'column'}
                        bgcolor={'pink'}
                    >
                        <Box
                            paddingX={8}
                            flex={1}
                            display={'flex'}
                            flexDirection={'column'}
                            paddingY={5}
                            rowGap={1}
                            style={{
                                overflowY: 'scroll',
                            }}
                        >
                            {categories
                                .filter((cat) => card.categories.includes(cat.id))
                                .map((cat) => (
                                    <CategoryPill
                                        key={cat.id}
                                        category={cat}
                                        onDeleteClick={() => {
                                            removeCategoryFromCard(cat)
                                        }}
                                    />
                                ))}
                        </Box>
                        <Box paddingX={4} height={CARD_SIZE_VALUES[CARD_IMAGE_SIZE.NORMAL].height / 4}>
                            <AddCategory
                                categories={categories}
                                onAdd={(cat) => {
                                    addCategoryToDB(cat)
                                }}
                            />
                        </Box>
                    </Box>
                    <Box
                        width={CARD_SIZE_VALUES[CARD_IMAGE_SIZE.NORMAL].width * 0.75}
                        height={CARD_SIZE_VALUES[CARD_IMAGE_SIZE.NORMAL].height}
                        display={'flex'}
                        flexDirection={'column'}
                        bgcolor={'pink'}
                    >
                        <Box
                            paddingX={8}
                            flex={1}
                            display={'flex'}
                            flexDirection={'column'}
                            paddingY={5}
                            rowGap={1}
                            style={{
                                overflowY: 'scroll',
                            }}
                        >
                            {categories.map((cat) => (
                                <CategoryPill
                                    key={cat.id}
                                    category={cat}
                                    onClick={() => {
                                        addCategoryToCard(cat)
                                    }}
                                    onDeleteClick={() => {
                                        removeCategoryFromDB(cat)
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CatalogueModal
