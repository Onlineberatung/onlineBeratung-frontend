import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Login } from './components/login/Login';
import { Stage } from './components/stage/stage';
import { ContextProvider } from './globalState/state';

ReactDOM.render(
	<ContextProvider>
		<Login stageComponent={Stage} />
	</ContextProvider>,
	document.getElementById('loginRoot')
);
