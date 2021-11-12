import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LegalInformationLinks } from './components/login/LegalInformationLinks';
import { Login } from './components/login/Login';
import { Stage } from './components/stage/stage';

ReactDOM.render(
	<Login stageComponent={Stage} legalComponent={LegalInformationLinks} />,
	document.getElementById('loginRoot')
);
