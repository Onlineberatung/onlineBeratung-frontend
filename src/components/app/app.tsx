import '../../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthenticatedAppContainer } from './AuthenticatedApp';
import { Registration } from '../registration/Registration';
import { LoginLoader } from './LoginLoader';
import '../../resources/styles/styles';
import { WaitingRoomLoader } from '../waitingRoom/WaitingRoomLoader';

export const history = createBrowserHistory();

const App = () => {
	// The login is possible both at the root URL as well as with an
	// optional resort name. Since resort names are dynamic, we have
	// to find out if the provided path is a resort name. If not, we
	// use the authenticated app as a catch-all fallback.
	const [hasUnmatchedResortLogin, setHasUnmatchedResortLogin] = useState(
		false
	);
	const [
		hasUnmatchedAnonyomousConversation,
		setHasUnmatchedAnonyomousConversation
	] = useState(false);

	const handleUnmatchResortLogin = () => {
		setHasUnmatchedResortLogin(true);
	};

	const handleUnmatchAnonyomousConversation = () => {
		setHasUnmatchedAnonyomousConversation(true);
	};

	return (
		<Router history={history}>
			<Switch>
				<Route path="/:consultingTypeSlug/registration">
					<Registration />
				</Route>
				{!hasUnmatchedAnonyomousConversation && (
					<Route path="/:consultingTypeSlug/warteraum">
						<WaitingRoomLoader
							handleUnmatch={handleUnmatchAnonyomousConversation}
						/>
					</Route>
				)}
				{!hasUnmatchedResortLogin && (
					<Route path="/:consultingTypeSlug">
						<LoginLoader handleUnmatch={handleUnmatchResortLogin} />
					</Route>
				)}
				<AuthenticatedAppContainer />
			</Switch>
		</Router>
	);
};

export const initApp = () => {
	ReactDOM.render(<App />, document.getElementById('appRoot'));
};
