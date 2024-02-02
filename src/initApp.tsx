import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/app/app';
import { Stage } from './components/stage/stage';
import { config } from './resources/scripts/config';

ReactDOM.render(
	<App config={config} stageComponent={Stage} />,
	document.getElementById('appRoot')
);
