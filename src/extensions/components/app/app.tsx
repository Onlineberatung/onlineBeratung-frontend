import * as React from 'react';
import { ThemeProvider } from '@mui/material';
import { UrlParamsProvider } from '../../../globalState/provider/UrlParamsProvider';
import { RegistrationProvider } from '../../../globalState';
import { App as CoreApp, AppProps } from '../../../components/app/app';
import { lazy } from 'react';
import '../../../resources/styles/mui-variables-mapping';
import theme from '../../theme';

const Registration = lazy(() =>
	import('../registration/Registration').then((m) => ({
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

export const App = (props: AppProps) => {
	// The login is possible both at the root URL as well as with an
	// optional resort name. Since resort names are dynamic, we have
	// to find out if the provided path is a resort name. If not, we
	// use the authenticated app as a catch-all fallback.

	const extraRoutes = [
		...props.extraRoutes,
		{
			route: {
				path: [
					'/registration',
					'/registration/topic-selection',
					'/registration/zipcode',
					'/registration/account-data',
					'/registration/agency-selection'
				]
			},
			component: NewRegistration
		}
	];

	return (
		<ThemeProvider theme={theme}>
			<CoreApp {...props} extraRoutes={extraRoutes} />
		</ThemeProvider>
	);
};
