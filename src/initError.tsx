import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorWrapper } from './components/error/Error';
import { config } from './resources/scripts/config';

ReactDOM.render(
	<ErrorWrapper config={config} />,
	document.getElementById('errorRoot')
);
