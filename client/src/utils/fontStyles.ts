import { TypographyStyleOptions } from '@material-ui/core/styles/createTypography'

interface FontStyle {
    [key: string]: TypographyStyleOptions
}

const fontStyles: FontStyle = {
    h1: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '2.875rem',
    },
    h2: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '1.875rem',
    },
    h3: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    h4: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '1.375rem',
    },
    h5: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '1.25rem',
    },
    h6: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '0.875rem',
    },
    body1: {
        fontSize: '1rem',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 1.1,
    },
    body2: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '1.125rem',
    },
    subtitle1: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '0.75rem',
    },
    subtitle2: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '0.625rem',
    },
    button: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '0.9375rem',
        textTransform: 'uppercase',
    },
    caption: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '0.94rem',
    },
}

export default fontStyles
