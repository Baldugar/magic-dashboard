import { createTheme, responsiveFontSizes } from '@mui/material/styles'
// import colors from './colors'
// import fontStyles from './fontStyles'
// const breakpoints = createBreakpoints({})
// export const smallMobile = 385
// export const smallestMobile = 360

const theme = createTheme({
    // palette: {
    //     primary: {
    //         main: colors.main,
    //     },
    //     secondary: {
    //         dark: colors.darkGray,
    //         light: colors.lightGray,
    //         main: colors.main,
    //     },
    //     text: {
    //         disabled: colors.midGray,
    //         primary: colors.black,
    //         secondary: colors.black,
    //     },
    // },
    // typography: {
    //     fontSize: 16,
    //     h1: { ...fontStyles.h1 },
    //     h2: { ...fontStyles.h2 },
    //     h3: { ...fontStyles.h3 },
    //     h4: { ...fontStyles.h4 },
    //     h5: { ...fontStyles.h5 },
    //     h6: { ...fontStyles.h6 },
    //     body1: { ...fontStyles.body1 },
    //     body2: { ...fontStyles.body2 },
    //     subtitle1: { ...fontStyles.subtitle1 },
    //     subtitle2: { ...fontStyles.subtitle2 },
    //     button: { ...fontStyles.button },
    //     caption: { ...fontStyles.caption },
    // },
})

export const ModifiedTheme = responsiveFontSizes(theme)
