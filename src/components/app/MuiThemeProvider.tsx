import * as React from 'react';
import { useMemo, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TenantContext } from '../../globalState';
import { createTenantMuiTheme } from '../../utils/muiTheme';

interface MuiThemeProviderProps {
	children: React.ReactNode;
}

/**
 * MuiThemeProvider wraps the app with Material-UI's ThemeProvider
 * and automatically updates the theme when tenant theming changes.
 * 
 * This component:
 * - Listens to tenant context changes
 * - Creates a MUI theme based on tenant colors (primaryColor, secondaryColor)
 * - Provides the theme to all MUI components in the app
 * - Ensures MUI components match the app's look and feel
 */
export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
	const tenantContext = useContext(TenantContext);

	// Create MUI theme based on tenant settings
	// Memoize to avoid recreating theme on every render
	const muiTheme = useMemo(
		() => createTenantMuiTheme(tenantContext?.tenant || null),
		[tenantContext?.tenant]
	);

	return (
		<ThemeProvider theme={muiTheme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};
