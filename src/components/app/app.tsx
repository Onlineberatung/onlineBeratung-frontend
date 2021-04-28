import '../../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthenticatedAppContainer } from './AuthenticatedApp';
import { Registration } from '../registration/Registration';
import '../../resources/styles/styles';

export const history = createBrowserHistory();

export const initApp = () => {
	ReactDOM.render(
		<Router history={history}>
			<Switch>
				<Route path="/:resortName/registration">
					<Registration />
				</Route>
				<AuthenticatedAppContainer />
			</Switch>
		</Router>,
		document.getElementById('appRoot')
	);
};
