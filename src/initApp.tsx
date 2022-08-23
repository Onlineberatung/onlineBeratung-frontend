import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { config } from './resources/scripts/config';

ReactDOM.render(
	<App
		entryPoint="/login"
		legalLinks={[
			{
				url: config.urls.imprint,
				label: 'login.legal.infoText.impressum'
			},
			{
				url: config.urls.privacy,
				label: 'login.legal.infoText.dataprotection',
				registration: true
			}
		]}
		stageComponent={Stage}
	/>,
	document.getElementById('appRoot')
);
