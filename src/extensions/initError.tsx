import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Error } from '../components/error/Error';
import { config } from './resources/scripts/config';

ReactDOM.render(
	<Error config={config} />,
	document.getElementById('errorRoot')
);
