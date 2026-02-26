import { createTheme, Theme } from '@mui/material/styles';
import { TenantDataInterface } from '../globalState/interfaces';

export const createTenantMuiTheme = (
	tenant: TenantDataInterface | null
): Theme => {
	const primaryColor = tenant?.theming?.primaryColor || '#0a6ebd';
	const secondaryColor = tenant?.theming?.secondaryColor || '#8c8c8e';

	return createTheme({
		palette: {
			primary: { main: primaryColor },
			secondary: { main: secondaryColor },
			text: {
				primary: '#1f1f1f',
				secondary: '#525c66'
			}
		},
		typography: {
			fontFamily:
				'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
			button: {
				textTransform: 'none',
				fontWeight: 500
			}
		},
		shape: {
			borderRadius: 4
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						padding: '8px 16px',
						fontSize: '14px',
						fontWeight: 500
					},
					contained: {
						boxShadow: 'none',
						'&:hover': { boxShadow: 'none' }
					}
				}
			}
		}
	});
};
