import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { config, routePathNames } from './resources/scripts/config';
import { TermsAndConditions } from './components/legalInformationLinks/TermsAndConditions';
import { Imprint } from './components/legalInformationLinks/Imprint';
import { Privacy } from './components/legalInformationLinks/Privacy';
import { MuiThemeTest } from './components/app/MuiThemeTest';

const container = document.getElementById('appRoot');
if (container) {
	const root = createRoot(container);
	root.render(
		<App
			config={config}
			extraRoutes={[
				{
					route: { path: routePathNames.termsAndConditions },
					component: TermsAndConditions
				},
				{ route: { path: routePathNames.imprint }, component: Imprint },
				{ route: { path: routePathNames.privacy }, component: Privacy },
				{ route: { path: '/mui-theme-test' }, component: MuiThemeTest }
			]}
			stageComponent={Stage}
		/>
	);
}
