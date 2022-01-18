import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { LegalInformationLinks } from './components/login/LegalInformationLinks';
import { Stage } from './components/stage/stage';

ReactDOM.render(
	<App
		entryPoint="/login"
		legalComponent={LegalInformationLinks}
		stageComponent={Stage}
	/>,
	document.getElementById('appRoot')
);
