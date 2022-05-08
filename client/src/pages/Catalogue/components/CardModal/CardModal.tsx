import { ExpandMore } from '@mui/icons-material'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Modal,
    Rating,
    TextField,
    Typography,
} from '@mui/material'
import { CategoryType, Color, MTGACard_User, Tag, UserTag } from 'graphql/types'
import { AddTagModal } from 'pages/Catalogue/components/CardModal/AddTagModal'
import { EditTagModal } from 'pages/Catalogue/components/CardModal/EditTagModal'
import CardModalCategoryPill from 'pages/Catalogue/components/CardModalCategoryPill/CardModalCategoryPill'
import CategoryPill from 'pages/Catalogue/components/CategoryPill'
import FlipCard from 'pages/Catalogue/components/FlipCard'
import NewCategoryInput from 'pages/Catalogue/components/NewCategoryInput'
import { useEffect, useState } from 'react'

export interface CardModalProps {
    userCard: MTGACard_User | null
    cardTags: Tag[]
    deckTags: Tag[]
    onNewCategoryAdd: (type: string, extra: string, colors: Color[], categoryType: CategoryType) => void
    onTagAddToCard: (tag: Tag, rating: number, comment: string) => void
    onTagUpdate: (tag: Tag, rating: number, comment: string) => void
    onMetaUpdate: (rating: number, comment: string) => void
    onTagRemove: (tag: Tag) => void
}

export const CardModal = (props: CardModalProps): JSX.Element => {
    const { userCard, onNewCategoryAdd, cardTags, deckTags, onTagAddToCard, onMetaUpdate, onTagUpdate, onTagRemove } =
        props

    console.log('CARD MODAL', userCard)

    const [rating, setRating] = useState(0)
    const [userCardTags, setUserCardTags] = useState<UserTag[]>([])
    const [userDeckTags, setUserDeckTags] = useState<UserTag[]>([])

    const [tagToAdd, setTagToAdd] = useState<Tag>()
    const [tagToEdit, setTagToEdit] = useState<UserTag>()
    const tagToAddDialogOpen = Boolean(tagToAdd)
    const tagToEditDialogOpen = Boolean(tagToEdit)

    useEffect(() => {
        if (userCard) {
            setRating(userCard.rating)
            setUserCardTags(userCard.userCardTags)
            setUserDeckTags(userCard.userDeckTags)
            const commentInput = document.getElementById('card_comment') as HTMLInputElement
            commentInput.value = userCard.comment
        }
    }, [userCard])

    if (!userCard) {
        return <div />
    }
    const { card } = userCard

    return (
        <Box height={'80vh'} width={'80vw'} bgcolor={'white'} display={'flex'} padding={3} columnGap={2}>
            <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <FlipCard card={card} />
            </Box>
            <Box
                flex={1}
                display={'flex'}
                flexDirection={'column'}
                rowGap={1}
                height={'100%'}
                maxHeight={'100%'}
                overflow={'hidden'}
            >
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant={'h6'}>
                            {card.name} | {card.type_line}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography component="legend">Card Rating</Typography>
                        <Rating
                            value={rating}
                            onChange={(_, rating) => {
                                if (rating) {
                                    setRating(rating)
                                }
                            }}
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            defaultValue={userCard.comment}
                            id={'card_comment'}
                            fullWidth
                            label={'Extra comments'}
                            multiline
                            minRows={3}
                            maxRows={5}
                        />
                        <Box mt={2}>
                            <Button
                                variant={'contained'}
                                onClick={() => {
                                    const element = document.getElementById('card_comment') as HTMLInputElement
                                    if (element) {
                                        onMetaUpdate(rating, element.value)
                                    }
                                }}
                                fullWidth
                            >
                                Save
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Box overflow={'auto'}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />} style={{ position: 'sticky' }}>
                            <Typography>Added Card Categories</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {userCardTags.length === 0 ? (
                                <Box>
                                    <Typography>No Card Categories</Typography>
                                </Box>
                            ) : (
                                userCardTags.map((tag) => (
                                    <Box key={tag.tag.id} style={{ backgroundColor: 'white' }}>
                                        <CardModalCategoryPill
                                            onClick={() => {
                                                console.log('EDITING TAG')
                                                setTagToEdit(tag)
                                            }}
                                            category={tag.tag}
                                            comment={tag.comment}
                                            rating={tag.rating}
                                        />
                                    </Box>
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>Added Deck Categories</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {userDeckTags.length === 0 ? (
                                <Box>
                                    <Typography>No Deck Categories</Typography>
                                </Box>
                            ) : (
                                userDeckTags.map((tag) => (
                                    <Box key={tag.tag.id} style={{ backgroundColor: 'white' }}>
                                        <CardModalCategoryPill
                                            onClick={() => setTagToEdit(tag)}
                                            category={tag.tag}
                                            comment={tag.comment}
                                            rating={tag.rating}
                                        />
                                    </Box>
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
            <Box flex={1} display={'flex'} flexDirection={'column'} overflow={'hidden'}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Create new category</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <NewCategoryInput
                            cardCategories={cardTags}
                            deckCategories={deckTags}
                            onSubmit={(type: string, extra: string, colors: Color[], categoryType: CategoryType) => {
                                onNewCategoryAdd(type, extra, colors, categoryType)
                            }}
                        />
                    </AccordionDetails>
                </Accordion>
                <Box overflow={'auto'}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>Card Categories</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {cardTags.length === 0 ? (
                                <Box>
                                    <Typography>No Card Categories</Typography>
                                </Box>
                            ) : (
                                cardTags.map((tag) => (
                                    <Box key={tag.id} style={{ backgroundColor: 'white', marginTop: 8 }}>
                                        <CategoryPill
                                            category={tag}
                                            onClick={() => setTagToAdd(tag)}
                                            disabled={userCardTags.some((cardTag) => cardTag.tag.id === tag.id)}
                                        />
                                    </Box>
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>Deck Categories</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {deckTags.length === 0 ? (
                                <Box>
                                    <Typography>No Deck Categories</Typography>
                                </Box>
                            ) : (
                                deckTags.map((tag) => (
                                    <Box key={tag.id} style={{ backgroundColor: 'white', marginTop: 8 }}>
                                        <CategoryPill
                                            category={tag}
                                            onClick={() => setTagToAdd(tag)}
                                            disabled={userDeckTags.some((deckTag) => deckTag.tag.id === tag.id)}
                                        />
                                    </Box>
                                ))
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
            <Modal
                open={tagToAddDialogOpen}
                onClose={() => {
                    setTagToAdd(undefined)
                }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <AddTagModal
                    tag={tagToAdd}
                    onSave={(rating, comment) => {
                        if (tagToAdd) {
                            onTagAddToCard(tagToAdd, rating, comment)
                            setTagToAdd(undefined)
                        }
                    }}
                />
            </Modal>
            <Modal
                open={tagToEditDialogOpen}
                onClose={() => {
                    setTagToEdit(undefined)
                }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <>
                    {tagToEdit && (
                        <EditTagModal
                            tag={tagToEdit}
                            onSave={(rating, comment) => {
                                if (tagToEdit) {
                                    onTagUpdate(tagToEdit.tag, rating, comment)
                                    setTagToEdit(undefined)
                                }
                            }}
                            onDelete={() => {
                                if (tagToEdit) {
                                    onTagRemove(tagToEdit.tag)
                                    setTagToEdit(undefined)
                                }
                            }}
                        />
                    )}
                </>
            </Modal>
        </Box>
    )
}
