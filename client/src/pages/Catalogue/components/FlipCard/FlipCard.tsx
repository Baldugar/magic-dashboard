import { Flip } from '@mui/icons-material'
import { Box, ButtonBase } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import ImageWithSkeleton from 'components/ImageWithSkeleton'
import { MTGACard } from 'graphql/types'
import { useEffect } from 'react'
import { CARD_IMAGE_SIZE, CARD_SIZE_VALUES } from 'utils/constants'

export interface FlipCardProps {
    card: MTGACard
}

const useStyles = makeStyles(() =>
    createStyles({
        flipCard: {
            backgroundColor: 'transparent',
            width: CARD_SIZE_VALUES['normal'].width,
            height: CARD_SIZE_VALUES['normal'].height,
            perspective: '1000px',
            '&.active #flipCard__inner': {
                transform: 'rotateY(180deg)',
            },
        },
        flipCard__inner: {
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        },
        flipCard__front: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
        },
        flipCard__back: {
            transform: 'rotateY(180deg)',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
        },
    }),
)

export const FlipCard = (props: FlipCardProps): JSX.Element => {
    const { card } = props

    const classes = useStyles()

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('flipCard')!.classList.remove('active')
    }, [card])

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const frontFace = card.card_faces ? card.card_faces[0].image_uris!.normal : card.image_uris!.normal
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const backFace = card.card_faces ? card.card_faces[1].image_uris!.normal : null

    return (
        <Box id={'flipCard'} className={classes.flipCard}>
            <Box id={'flipCard__inner'} className={classes.flipCard__inner}>
                <Box className={classes.flipCard__front}>
                    <ImageWithSkeleton imageSize={CARD_IMAGE_SIZE.NORMAL} img={frontFace} />
                    {backFace && (
                        <ButtonBase
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                document.getElementById('flipCard')!.classList.toggle('active')
                            }}
                            style={{
                                position: 'absolute',
                                top: 'calc(50% - 20px)',
                                right: '0px',
                            }}
                        >
                            <Box
                                width={'40px'}
                                height={'40px'}
                                bgcolor={'white'}
                                border={'1px solid black'}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Flip />
                            </Box>
                        </ButtonBase>
                    )}
                </Box>
                {backFace && (
                    <Box className={classes.flipCard__back}>
                        <ImageWithSkeleton imageSize={CARD_IMAGE_SIZE.NORMAL} img={backFace} />
                        <ButtonBase
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                document.getElementById('flipCard')!.classList.toggle('active')
                            }}
                            style={{
                                position: 'absolute',
                                top: 'calc(50% - 20px)',
                                right: '0px',
                            }}
                        >
                            <Box
                                width={'40px'}
                                height={'40px'}
                                bgcolor={'white'}
                                border={'1px solid black'}
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Flip />
                            </Box>
                        </ButtonBase>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
