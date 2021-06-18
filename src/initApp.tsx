import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';

ReactDOM.render(
	<App stageComponent={Stage} />,
	document.getElementById('appRoot')
);
