import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Login } from './components/login/Login';
import { Stage } from './components/stage/stage';

ReactDOM.render(
	<Login stageComponent={Stage} />,
	document.getElementById('loginRoot')
);
