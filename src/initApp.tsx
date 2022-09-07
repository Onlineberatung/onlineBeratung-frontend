import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { config } from './resources/scripts/config';
import { translate } from './utils/translate';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
serviceWorkerRegistration.register({});
navigator.serviceWorker.ready.then(async (registration) => {
	console.log(registration);
	await (registration as any).periodicSync.register('get-latest-news', {
		minInterval: 10000
	});
});

ReactDOM.render(
	<App
		entryPoint="/login"
		legalLinks={[
			{
				url: config.urls.imprint,
				label: translate('login.legal.infoText.impressum')
			},
			{
				url: config.urls.privacy,
				label: translate('login.legal.infoText.dataprotection'),
				registration: true
			}
		]}
		stageComponent={Stage}
	/>,
	document.getElementById('appRoot')
);
