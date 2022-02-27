import {
    Checkbox,
    CheckboxProps,
    Chip,
    ChipProps,
    FormControlLabel,
    FormControlLabelProps,
    IconButton,
    IconButtonProps,
} from '@mui/material'
import React, { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { isNegativeTB, isNotUnsetTB, isPositiveTB, TernaryBoolean } from 'utils/ternaryBoolean'

export type TernaryToggleProps =
    | { value: TernaryBoolean | undefined; type: 'chip'; chipProps: ChipProps }
    | {
          value: TernaryBoolean | undefined
          type: 'icon'
          iconButtonProps: IconButtonProps
          imgProps: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
      }
    | {
          value: TernaryBoolean | undefined
          type: 'category'
      }
    | {
          value: TernaryBoolean | undefined
          type: 'checkbox'
          labelProps: Omit<FormControlLabelProps, 'control'>
          checkboxProps: CheckboxProps
      }

const TernaryToggle = (props: TernaryToggleProps): JSX.Element => {
    const { type } = props
    switch (type) {
        case 'chip':
            const { chipProps } = props
            return <Chip {...chipProps} clickable />
        case 'checkbox': {
            const { labelProps, checkboxProps, value } = props
            return (
                <FormControlLabel
                    {...labelProps}
                    control={
                        <Checkbox
                            checked={isPositiveTB(value)}
                            indeterminate={isNegativeTB(value)}
                            {...checkboxProps}
                        />
                    }
                />
            )
        }
        case 'icon': {
            const { iconButtonProps, imgProps, value } = props
            const imgWidth = imgProps.width
                ? typeof imgProps.width === 'string'
                    ? Number(imgProps.width.split('px')[0])
                    : imgProps.width
                : undefined
            const imgHeight = imgProps.height
                ? typeof imgProps.height === 'string'
                    ? Number(imgProps.height.split('px')[0])
                    : imgProps.height
                : undefined
            const iconWidth = imgWidth ? imgWidth / 4 : undefined
            const iconHeight = imgHeight ? imgHeight / 4 : undefined
            return (
                <IconButton {...iconButtonProps}>
                    <img {...imgProps} style={{ ...imgProps.style, position: 'relative' }} />
                    {isNotUnsetTB(value) && (
                        <img
                            style={{
                                position: 'absolute',
                                top: imgHeight && iconHeight ? (imgHeight - iconHeight) / 2 + 5 : 0,
                                backgroundColor: isPositiveTB(value) ? '#00ff00' : '#ff0000',
                                borderRadius: imgHeight ? imgHeight / 2 : undefined,
                            }}
                            width={iconWidth}
                            height={iconHeight}
                            src={`/img/general/${isPositiveTB(value) ? 'check' : 'cancel'}.svg`}
                        />
                    )}
                </IconButton>
            )
        }
        default:
            return <div />
    }
}

export default TernaryToggle
