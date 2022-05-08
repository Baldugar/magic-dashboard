import { Box, Button, Rating, TextField, Typography } from '@mui/material'
import { UserTag } from 'graphql/types'
import CategoryPill from 'pages/Catalogue/components/CategoryPill'
import { useState } from 'react'

export interface EditTagModalProps {
    tag: UserTag
    onSave: (rating: number, comment: string) => void
    onDelete: () => void
}

export const EditTagModal = (props: EditTagModalProps) => {
    const { onSave, tag, onDelete } = props

    const [rating, setRating] = useState(tag.rating)

    return (
        <Box padding={3} bgcolor={'white'} display={'flex'} flexDirection={'column'} width={'20vw'} rowGap={2}>
            <CategoryPill category={tag.tag} />
            <Box>
                <Typography component="legend">Card Rating inside this category</Typography>
                <Rating
                    value={rating}
                    onChange={(_, rating) => {
                        if (rating) {
                            setRating(rating)
                        }
                    }}
                />
            </Box>
            <TextField
                InputLabelProps={{ shrink: true }}
                defaultValue={tag.comment}
                fullWidth
                id={'add-tag-modal-comment'}
                label={'Extra Comment'}
                multiline
                minRows={3}
                maxRows={5}
            />
            <Box display={'flex'} columnGap={1}>
                <Button variant={'contained'} fullWidth onClick={onDelete} color={'secondary'}>
                    Remove from card
                </Button>
                <Button
                    variant={'contained'}
                    disabled={rating === 0}
                    fullWidth
                    onClick={() => {
                        const commentInput = document.getElementById('add-tag-modal-comment') as HTMLInputElement
                        if (commentInput) {
                            onSave(rating, commentInput.value)
                        }
                    }}
                >
                    Save
                </Button>
            </Box>
        </Box>
    )
}
