import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { UseAppConfigProvider } from './globalState';
import { config } from './resources/scripts/config';
import { translate } from './utils/translate';

ReactDOM.render(
	<UseAppConfigProvider>
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
		/>
	</UseAppConfigProvider>,
	document.getElementById('appRoot')
);
