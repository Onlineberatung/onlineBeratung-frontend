import { createTheme, Theme } from '@mui/material/styles';
import { TenantDataInterface } from '../globalState/interfaces';

/**
 * Create a MUI theme based on tenant theming settings
 * This integrates the tenant's primaryColor and secondaryColor into MUI's design system
 * while preserving the look and feel of the rest of the app
 */
export const createTenantMuiTheme = (
	tenant: TenantDataInterface | null
): Theme => {
	const primaryColor = tenant?.theming?.primaryColor || '#0a6ebd';
	const secondaryColor = tenant?.theming?.secondaryColor || '#8c8c8e';

	return createTheme({
		palette: {
			primary: {
				main: primaryColor
			},
			secondary: {
				main: secondaryColor
			},
			// Match the app's color scheme
			background: {
				default: '#f5f5f5',
				paper: '#ffffff'
			},
			text: {
				primary: '#1f1f1f',
				secondary: '#525c66'
			}
		},
		typography: {
			// Use the app's actual font family (Nunito)
			fontFamily: 'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
			// Match button text styling in the app
			button: {
				textTransform: 'none', // Don't uppercase button text by default
				fontWeight: 500
			}
		},
		shape: {
			// Match the app's border radius
			borderRadius: 4
		},
		components: {
			// Customize MUI components to match app styling
			MuiButton: {
				styleOverrides: {
					root: {
						// Match button styling from the app
						borderRadius: 4,
						padding: '8px 16px',
						fontSize: '14px',
						fontWeight: 500
					},
					contained: {
						boxShadow: 'none',
						'&:hover': {
							boxShadow: 'none'
						}
					}
				}
			},
			MuiTextField: {
				defaultProps: {
					variant: 'outlined'
				},
				styleOverrides: {
					root: {
						// Match input field styling
						'& .MuiOutlinedInput-root': {
							borderRadius: 4
						}
					}
				}
			},
			MuiSelect: {
				defaultProps: {
					variant: 'outlined'
				},
				styleOverrides: {
					root: {
						borderRadius: 4
					}
				}
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						borderRadius: 4
					}
				}
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						// Match tooltip styling
						backgroundColor: 'rgba(0, 0, 0, 0.87)',
						fontSize: '12px'
					}
				}
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 4,
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
					}
				}
			}
		}
	});
};
