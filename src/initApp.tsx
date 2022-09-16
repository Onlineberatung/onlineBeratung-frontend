import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { UseAppConfigProvider } from './globalState';

ReactDOM.render(
	<UseAppConfigProvider>
		<App entryPoint="/login" stageComponent={Stage} />
	</UseAppConfigProvider>,
	document.getElementById('appRoot')
);
