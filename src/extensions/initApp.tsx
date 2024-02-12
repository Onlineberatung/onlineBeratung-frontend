import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '../components/app/app';
import { Stage } from './components/stage/stage';
import { config, routePathNames } from './resources/scripts/config';
import { TermsAndConditions } from './components/legalInformationLinks/TermsAndConditions';
import { Imprint } from './components/legalInformationLinks/Imprint';
import { Privacy } from './components/legalInformationLinks/Privacy';

ReactDOM.render(
	<App
		config={config}
		extraRoutes={[
			{
				route: { path: routePathNames.termsAndConditions },
				component: TermsAndConditions
			},
			{ route: { path: routePathNames.imprint }, component: Imprint },
			{ route: { path: routePathNames.privacy }, component: Privacy }
		]}
		stageComponent={Stage}
	/>,
	document.getElementById('appRoot')
);
