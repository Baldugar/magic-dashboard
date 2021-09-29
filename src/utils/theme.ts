import { createTheme, responsiveFontSizes, Theme } from '@material-ui/core'
import colors from './colors'
import fontStyles from './fontStyles'
// const breakpoints = createBreakpoints({})
// export const smallMobile = 385
// export const smallestMobile = 360

const theme: Theme = createTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                '&.JackAddButton': {
                    margin: 16,
                    padding: 16,
                    paddingRight: 24,
                    borderRadius: 8,
                    backgroundColor: colors.yellow,
                    border: `1px solid ${colors.yellow}`,
                    zIndex: 1200,
                },
                '&.JackButton': {
                    borderBottom: `1px solid ${colors.lightGray}`,
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: 8,
                    zIndex: 1200,
                    '&:hover': {
                        backgroundColor: colors.yellow,
                    },
                },
                '&.pedalJackListEntry': {
                    width: '100%',
                    fontSize: 15,
                    fontFamily: 'Manrope',
                    paddingTop: 13,
                    paddingBottom: 13,
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: colors.yellow,
                    },
                },
            },
        },
        MuiButton: {
            root: {
                '&.button-standard': {
                    borderRadius: 0,
                    boxShadow: 'none',
                    backgroundColor: colors.yellow,
                    height: '100%',
                },
            },
        },
        MuiChip: {
            label: {
                color: colors.white,
                fontSize: 15,
                letterSpacing: '0.1em',
                lineHeight: '26px',
                fontFamily: 'ClashGrotesk-Bold',
            },
            root: {
                borderRadius: 0,
                // TODO: Decide which type gets which color undecided are currently in red
                '&.MuiChip-clickable': {
                    opacity: 0.2,
                    backgroundColor: colors.black,
                    '&:hover': {
                        backgroundColor: colors.black,
                    },
                    '&:focus': {
                        backgroundColor: colors.black,
                    },

                    '&.multi, &.switcher, &.distortion, &.booster, &.cab_sim, &.fuzz, &.overdrive, &.bitcrusher, &.wavefolder, &.rotary, &.tremolo, &.phaser, &.flanger, &.vibrato, &.chorus, &.wah, &.octaver, &.pitch_shifter, &.harmonizer, &.equalizer, &.compressor, &.delay, &.reverb, &.looper, &.tuner, &.expression, &.volume, &.di, &.noise_gate, &.switcher, &.multi':
                        {
                            opacity: 1,
                            backgroundColor: colors.warning,
                        },
                    // '': {
                    //     backgroundColor: colors.teal,
                    // },
                    // '': {
                    //     backgroundColor: colors.orange,
                    // },
                    // '': {
                    //     backgroundColor: colors.green,
                    // },
                },
                '&.TabPanelSubHeader': {
                    fontWeight: '400',
                },
            },
        },
        MuiBackdrop: {
            root: {
                '&.LoadingSpinner': {
                    zIndex: 1400,
                    color: colors.white,
                },
            },
        },
        MuiCircularProgress: {
            root: {
                '&.PedalPaneLoadingSpinner': {
                    zIndex: 1400,
                    color: colors.green,
                },
            },
        },
        MuiDialogContent: {
            root: {
                '&.BuildOverlay': {
                    padding: 24,
                    minHeight: '65vh',
                    backgroundColor: colors.lightGray,
                },
            },
        },
        MuiGrid: {
            root: {
                '&.JackAddButtonGrid': {
                    width: '100%',
                },
                '&.JackButtonHeader': {
                    borderBottom: `1px solid ${colors.lightGray}`,
                    width: '100%',
                    justifyContent: 'flex-start',
                    padding: 8,
                    cursor: 'default',
                    zIndex: 1200,
                },
                '&.DropzoneContent': {
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                },
                '&.uploadImage': {
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 25,
                    borderRadius: 8,
                    border: `2px dotted ${colors.midGray}`,
                    backgroundColor: colors.white,
                    width: '100%',
                    textAlign: 'center',
                },
                '&.uploadImage:hover': {
                    color: colors.lightBlue,
                    border: `2px dotted ${colors.lightBlue}`,
                    cursor: 'pointer',
                },
                '&.uploadImage.hover': {
                    color: colors.white,
                    backgroundColor: colors.lightBlue,
                    border: `2px dotted ${colors.white}`,
                },
                '&.uploadError': {
                    border: `2px dotted ${colors.warning}`,
                },
            },
        },
        MuiInputBase: {
            root: {
                '&.RockInputBase': {
                    '&.FixedHeight': {
                        height: 60,
                    },
                    minHeight: 60,
                    padding: 16,
                    backgroundColor: colors.white,
                    alignItems: 'flex-start',
                },
                adornedEnd: {
                    '& .inputSuffix': {
                        color: colors.midGray,
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        marginLeft: 12,
                    },
                },
                input: { fontSize: 20, height: '100%', padding: 0 },
            },
        },
        MuiCheckbox: {
            root: {
                color: colors.darkGray,
                // backgroundColor: 'black',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0)!important',
                },
                '&.toggleButtonControlCheckbox.MuiCheckbox-colorSecondary.Mui-checked': {
                    color: colors.darkGreen,
                },
            },
        },
        MuiRadio: {
            root: {
                color: colors.darkGray,
                // backgroundColor: 'black',
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0)!important',
                },
                '&.toggleButtonControlRadio.MuiRadio-colorSecondary.Mui-checked': {
                    color: colors.darkGreen,
                },
            },
        },
        MuiList: {
            root: {
                '&.ErrorBox': {
                    padding: 20,
                    marginTop: 20,
                    width: '100%',
                    borderRadius: 4,
                    backgroundColor: colors.lightWarning,
                },
            },
        },
        MuiListItem: {
            root: {
                '&.ErrorBoxListItem': {
                    color: colors.warning,
                },
            },
        },
        MuiListItemIcon: {
            root: {
                '&.ErrorBox': {
                    height: '7px',
                    width: '7px',
                    minWidth: 28,
                },
            },
        },
        MuiListSubheader: {
            root: {
                '&.ErrorBox': {
                    color: colors.warning,
                    fontSize: '1.375rem',
                },
            },
        },
        MuiPaper: {
            root: {
                '&.JackAddButtonPaper': {
                    borderRadius: 8,
                    padding: 4,
                    maxWidth: 300,
                    zIndex: 1200,
                    transition: 'bottom 250ms;',
                },
            },
        },
        MuiSvgIcon: {
            root: {
                '&.ErrorBox': {
                    height: '7px',
                    width: '7px',
                    color: colors.warning,
                },
            },
        },
        MuiTypography: {
            root: {
                '&.JackAddButton': {
                    textTransform: 'uppercase',
                    fontFamily: 'ClashGrotesk-Semibold',
                    fontWeight: 600,
                },
            },
        },
    },
    palette: {
        primary: {
            main: colors.main,
        },
        secondary: {
            dark: colors.darkGray,
            light: colors.lightGray,
            main: colors.main,
        },
        text: {
            disabled: colors.midGray,
            primary: colors.black,
            secondary: colors.white,
        },
    },
    typography: {
        fontSize: 16,
        fontFamily: 'ClashGrotesk-Regular',
        h1: { ...fontStyles.h1 },
        h2: { ...fontStyles.h2 },
        h3: { ...fontStyles.h3 },
        h4: { ...fontStyles.h4 },
        h5: { ...fontStyles.h5 },
        h6: { ...fontStyles.h6 },
        body1: { ...fontStyles.body1 },
        body2: { ...fontStyles.body2 },
        subtitle1: { ...fontStyles.subtitle1 },
        subtitle2: { ...fontStyles.subtitle2 },
        button: { ...fontStyles.button },
        caption: { ...fontStyles.caption },
    },
})

export const ModifiedTheme = responsiveFontSizes(theme)
