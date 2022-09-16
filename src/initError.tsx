import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Error } from './components/error/Error';
import { LocaleProvider } from './globalState';
import { UseAppConfigProvider } from './globalState/context/useAppConfig';

ReactDOM.render(
	<UseAppConfigProvider>
		<LocaleProvider>
			<Error />
		</LocaleProvider>
	</UseAppConfigProvider>,
	document.getElementById('errorRoot')
);
