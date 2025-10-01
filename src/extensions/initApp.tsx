import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '../components/app/app';
import { Stage } from './components/stage/stage';
import { config, routePathNames } from './resources/scripts/config';
import { Imprint } from './components/legalInformationLinks/Imprint';
import { Privacy } from './components/legalInformationLinks/Privacy';
import { TermsAndConditions } from './components/legalInformationLinks/TermsAndConditions';

ReactDOM.render(
	<App
		extraRoutes={[
			{
				route: { path: routePathNames.termsAndConditions },
				component: TermsAndConditions
			},
			{ route: { path: routePathNames.imprint }, component: Imprint },
			{ route: { path: routePathNames.privacy }, component: Privacy }
		]}
		stageComponent={Stage}
		legalLinks={[
			{
				url: routePathNames.imprint,
				label: 'login.legal.infoText.impressum'
			},
			{
				url: routePathNames.privacy,
				label: 'login.legal.infoText.dataprotection',
				registration: true
			}
		]}
		config={config}
	/>,
	document.getElementById('appRoot')
);
