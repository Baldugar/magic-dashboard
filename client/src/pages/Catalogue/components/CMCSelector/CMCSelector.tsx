import { Box } from '@mui/system'
import TernaryToggle from 'pages/Catalogue/components/TernaryToggle'
import React from 'react'
import { CMCFilter } from 'store/CatalogueState/CatalogueState.reducer'
import { TernaryBoolean } from 'utils/ternaryBoolean'

export interface CMCSelectorProps {
    iconSize?: number
    selected: { [key in CMCFilter]: TernaryBoolean }
    setSelected: (color: CMCFilter) => void
    setSelectedPrev: (color: CMCFilter) => void
}

const CMCSelector = (props: CMCSelectorProps): JSX.Element => {
    const { iconSize, selected, setSelected, setSelectedPrev } = props
    const CMC: CMCFilter[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'infinite']

    return (
        <>
            {Object.values(CMC).map((c) => (
                <Box key={c} display={'flex'} alignItems={'center'}>
                    <TernaryToggle
                        value={selected[c]}
                        type={'icon'}
                        iconButtonProps={{
                            size: 'small',
                            onClick: () => setSelected(c),
                            onContextMenu: (e) => {
                                e.preventDefault()
                                setSelectedPrev(c)
                            },
                        }}
                        imgProps={{
                            src: `/img/cmc/${c}.svg`,
                            width: iconSize ?? 40,
                            height: iconSize ?? 40,
                            style: { opacity: selected[c] ? 1 : 0.3, transition: 'opacity 250ms' },
                        }}
                    />
                </Box>
            ))}
        </>
    )
}

export default CMCSelector
