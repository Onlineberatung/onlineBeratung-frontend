import '../src/resources/styles/styles.scss';
import '../src/resources/styles/mui-variables-mapping.scss';
import i18n from 'i18next';
import { ThemeProvider } from '@mui/material';
import type { Preview } from '@storybook/react';
import * as React from 'react';
import theme from '../src/extensions/theme';
//import i18n from './i18next';
import { config } from '../src/resources/scripts/config';
import { LegalLinksProvider } from '../src/globalState/provider/LegalLinksProvider';
import { init, FALLBACK_LNG } from '../src/i18n';
import { BrowserRouter as Router } from 'react-router-dom';
init(config.i18n);

export const withMuiTheme = (Story) => (
	<Router>
		<ThemeProvider theme={theme}>
			<LegalLinksProvider legalLinks={config.legalLinks}>
				<Story />
			</LegalLinksProvider>
		</ThemeProvider>
	</Router>
);

export const decorators = [withMuiTheme];

const locales = {};
(config.i18n.supportedLngs || []).forEach((supportLng) => {
	const lng = supportLng.split('_informal')[0];
	locales[supportLng] = i18n.getResource(FALLBACK_LNG, 'languages', lng);
	if (supportLng.indexOf('_informal') >= 0) {
		locales[supportLng] += ' (informal)';
	}
});

const preview: Preview = {
	parameters: {
		i18n,
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		}
	},
	globals: {
		locale: FALLBACK_LNG,
		locales
	},
	decorators: [withMuiTheme]
};

export default preview;
