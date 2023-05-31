import '../src/resources/styles/styles.scss';
import '../src/resources/styles/mui-variables-mapping.scss';
import { ThemeProvider } from '@mui/material';
import type { Preview } from '@storybook/react';
import React from 'react';
import theme from '../src/theme';
import i18n from './i18next';

export const parameters = {
	i18n,
	locale: 'de',
	locales: {
		de: 'Deutsch',
		en: 'English',
		de_informal: 'Deutsch (informal)'
	}
};

export const withMuiTheme = (Story) => (
	<ThemeProvider theme={theme}>
		<Story />
	</ThemeProvider>
);

export const decorators = [withMuiTheme];

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		}
	},
	decorators: [withMuiTheme]
};

export default preview;
