import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';

ReactDOM.render(
	<App entryPoint="/login" stageComponent={Stage} />,
	document.getElementById('appRoot')
);
