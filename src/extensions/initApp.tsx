import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '../components/app/app';
import { Stage } from './components/stage/stage';
import { ConsultingTypes } from './components/consultingTypes/ConsultingTypes';
import { Imprint } from './components/legalInformationLinks/Imprint';
import { DataProtection } from './components/legalInformationLinks/DataProtection';
import { config, legalLinks } from './resources/scripts/config';

ReactDOM.render(
	<App
		config={config}
		extraRoutes={[
			{
				route: {
					path: '/themen'
				},
				component: ConsultingTypes
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
	/>,
	document.getElementById('appRoot')
);
