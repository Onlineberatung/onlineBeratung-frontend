import * as React from 'react';
import { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthenticatedAppContainer } from './AuthenticatedApp';
import { Registration } from '../registration/Registration';
import { LoginLoader } from './LoginLoader';
import '../../resources/styles/styles';

export const history = createBrowserHistory();

export const App = () => {
	// The login is possible both at the root URL as well as with an
	// optional resort name. Since resort names are dynamic, we have
	// to find out if the provided path is a resort name. If not, we
	// use the authenticated app as a catch-all fallback.
	const [hasUnmatchedResortLogin, setHasUnmatchedResortLogin] = useState(
		false
	);

	const handleUnmatchResortLogin = () => {
		setHasUnmatchedResortLogin(true);
	};

	return (
		<Router history={history}>
			<Switch>
				<Route path="/:resortName/registration">
					<Registration />
				</Route>
				{!hasUnmatchedResortLogin && (
					<Route path="/:resortName">
						<LoginLoader handleUnmatch={handleUnmatchResortLogin} />
					</Route>
				)}
				<AuthenticatedAppContainer />
			</Switch>
		</Router>
	);
};
