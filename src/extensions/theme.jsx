import { createTheme } from '@mui/material/styles';

const getCssVarValue = (name) =>
	// If you need a scss variable add a css variable for it in mui-variables-mapping.scss
	getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// A custom theme for this app
const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 520,
			md: 600,
			lg: 1200,
			xl: 1600
		}
	},
	palette: {
		primary: {
			dark: getCssVarValue('--primary-3'),
			main: getCssVarValue('--primary'),
			light: getCssVarValue('--background-light'),
			lighter: getCssVarValue('--background-lighter')
		},
		info: {
			main: getCssVarValue('--black'),
			light: getCssVarValue('--tertiary')
		},
		error: {
			main: getCssVarValue('--form-error')
		},
		success: {
			main: getCssVarValue('--form-success')
		}
	},

	typography: {
		fontFamily: ['Roboto', 'cursive', 'sans-serif'].join(','),
		h1: {
			color: getCssVarValue('--black'),
			letterSpacing: 'normal',
			fontSize: getCssVarValue('--font-size-h1'),
			lineHeight: '50px',
			fontWeight: getCssVarValue('--font-weight-medium'),
			fontFamily: getCssVarValue('--font-family-sans-serif')
		},
		h2: {
			color: getCssVarValue('--black'),
			letterSpacing: 'normal',
			fontSize: getCssVarValue('--font-size-h2'),
			lineHeight: '38px',
			fontWeight: getCssVarValue('--font-weight-medium'),
			fontFamily: getCssVarValue('--font-family-sans-serif')
		},
		h3: {
			color: getCssVarValue('--black'),
			letterSpacing: 'normal',
			fontSize: getCssVarValue('--font-size-h3'),
			lineHeight: '32px',
			fontWeight: getCssVarValue('--font-weight-medium'),
			fontFamily: getCssVarValue('--font-family-sans-serif')
		},
		h4: {
			color: getCssVarValue('--black'),
			letterSpacing: 'normal',
			fontSize: getCssVarValue('--font-size-h4'),
			lineHeight: '26px',
			fontWeight: getCssVarValue('--font-weight-medium'),
			fontFamily: getCssVarValue('--font-family-sans-serif')
		},
		h5: {
			color: getCssVarValue('--black'),
			letterSpacing: 'normal',
			fontSize: getCssVarValue('--font-size-h5'),
			lineHeight: '24px',
			fontWeight: getCssVarValue('--font-weight-medium'),
			fontFamily: getCssVarValue('--font-family-sans-serif')
		},
		body1: {
			fontFamily: getCssVarValue('--font-family-sans-serif'),
			color: getCssVarValue('--black'),
			lineHeight: getCssVarValue('--line-height-primary'),
			fontSize: getCssVarValue('--font-size-primary')
		},
		body2: {
			fontFamily: getCssVarValue('--font-family-sans-serif'),
			color: 'black',
			fontSize: getCssVarValue('--font-size-tertiary'),
			lineHeight: '20px'
		},
		subtitle1: {
			fontFamily: getCssVarValue('--font-family-sans-serif'),
			color: 'black',
			fontSize: '20px',
			lineHeight: '28px'
		},
		subtitle2: {
			fontFamily: getCssVarValue('--font-family-sans-serif'),
			color: 'black',
			fontSize: '12px',
			lineHeight: '16px'
		}
	},
	components: {
		MuiLink: {
			styleOverrides: {
				root: {
					'&:hover': {
						color: getCssVarValue('--hover-primary')
					}
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					'&:hover': {
						color: 'white'
					}
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					fontSize: getCssVarValue('--font-size-primary'),
					lineHeight: '20px',
					borderRadius: getCssVarValue('--button-border-radius')
				},
				contained: {
					'paddingTop': '14px',
					'paddingBottom': '14px',
					'borderRadius': getCssVarValue('--button-border-radius'),
					'backgroundColor': 'primary.main',
					'textTransform': 'none',
					'outline': 'none',
					'color': getCssVarValue('--white'),
					'fontWeight': getCssVarValue('--font-weight-regular'),
					'fontFamily': getCssVarValue('--font-family-sans-serif'),
					'boxShadow': 'none',
					'&:hover': {
						boxShadow: 'none',
						color: getCssVarValue('--white')
					}
				},
				outlined: {
					'paddingTop': '14px',
					'paddingBottom': '14px',
					'borderRadius': getCssVarValue('--button-border-radius'),
					'textTransform': 'none',
					'&:hover': {
						backgroundColor: getCssVarValue('--hover-primary'),
						borderColor: getCssVarValue('--hover-primary'),
						color: getCssVarValue('--white')
					}
				}
			}
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					lineHeight: '20px',
					fontSize: getCssVarValue('--font-size-tertiary'),
					color: getCssVarValue('--black'),
					backgroundColor: getCssVarValue('--white'),
					fontWeight: getCssVarValue('--font-weight-regular'),
					fontFamily: getCssVarValue('--font-family-sans-serif'),
					borderRadius: '4px',
					maxWidth: '270px',
					boxShadow: '0px 0px 10px 0px rgba(153,153,153,1)',
					padding: '17px 24px'
				},
				arrow: {
					color: getCssVarValue('--white')
				}
			}
		}
	}
});

export default theme;
