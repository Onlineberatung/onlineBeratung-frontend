import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Error } from './components/error/Error';
import { UseAppConfigProvider } from './globalState/context/useAppConfig';

ReactDOM.render(
	<UseAppConfigProvider>
		<Error />
	</UseAppConfigProvider>,
	document.getElementById('errorRoot')
);
