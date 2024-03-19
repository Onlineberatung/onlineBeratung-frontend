import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material';
import { App } from '../components/app/app';
import { Stage } from './components/stage/stage';
import { Imprint } from './components/legalInformationLinks/Imprint';
import { DataProtection } from './components/legalInformationLinks/DataProtection';
import { config, legalLinks } from './resources/scripts/config';
import { UrlParamsProvider } from '../globalState/provider/UrlParamsProvider';
import { RegistrationProvider } from '../globalState';
import { lazy } from 'react';
import '../resources/styles/mui-variables-mapping.scss';
import theme from './theme';
import { Redirect } from 'react-router-dom';

const Registration = lazy(() =>
	import('./components/registration/Registration').then((m) => ({
		default: m.Registration
	}))
);

const NewRegistration = () => (
	<UrlParamsProvider>
		<RegistrationProvider>
			<Registration />
		</RegistrationProvider>
	</UrlParamsProvider>
);

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<App
			config={config}
			extraRoutes={[
				{
					route: {
						path: [
							'/registration/:step?',
							'/:topicSlug/registration/:step?'
						]
					},
					component: NewRegistration
				},
				{
					route: {
						path: '/themen'
					},
					component: () => (
						<Redirect
							to={'/registration/topic-selection'}
							from={'/themen'}
						/>
					)
				},
				{
					route: {
						path: legalLinks.imprint
					},
					component: Imprint
				},
				{
					route: {
						path: legalLinks.privacy
					},
					component: DataProtection
				}
			]}
			stageComponent={Stage}
		/>
	</ThemeProvider>,
	document.getElementById('appRoot')
);
