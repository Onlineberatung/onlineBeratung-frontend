import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Error } from './components/error/Error';
import { LocaleProvider } from './globalState';

ReactDOM.render(
	<LocaleProvider>
		<Error />
	</LocaleProvider>,
	document.getElementById('errorRoot')
);
