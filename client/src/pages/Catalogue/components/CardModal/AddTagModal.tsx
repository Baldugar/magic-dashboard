import { Box, Button, Rating, TextField, Typography } from '@mui/material'
import { Tag } from 'graphql/types'
import CategoryPill from 'pages/Catalogue/components/CategoryPill'
import { useState } from 'react'

export interface AddTagModalProps {
    tag: Tag | undefined
    onSave: (rating: number, comment: string) => void
}

export const AddTagModal = (props: AddTagModalProps) => {
    const { onSave, tag } = props

    const [rating, setRating] = useState(0)

    return (
        <Box padding={3} bgcolor={'white'} display={'flex'} flexDirection={'column'} width={'20vw'} rowGap={2}>
            {tag && <CategoryPill category={tag} />}
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
                fullWidth
                id={'add-tag-modal-comment'}
                label={'Extra Comment'}
                multiline
                minRows={3}
                maxRows={5}
            />
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
    )
}
