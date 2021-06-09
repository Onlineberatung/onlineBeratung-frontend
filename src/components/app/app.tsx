import '../../polyfill';
import * as React from 'react';
import { ComponentType, ReactNode, useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthenticatedAppContainer } from './AuthenticatedApp';
import { Registration } from '../registration/Registration';
import { LoginLoader } from './LoginLoader';
import { StageProps } from '../stage/stage';
import '../../resources/styles/styles';

export const history = createBrowserHistory();

interface AppProps {
	stageComponent: ComponentType<StageProps>;
	extraRoutes?: ReactNode;
}

export const App = ({ stageComponent, extraRoutes }: AppProps) => {
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
				{extraRoutes}
				<Route path="/:consultingTypeSlug/registration">
					<Registration stageComponent={stageComponent} />
				</Route>
				{!hasUnmatchedResortLogin && (
					<Route path="/:consultingTypeSlug">
						<LoginLoader
							stageComponent={stageComponent}
							handleUnmatch={handleUnmatchResortLogin}
						/>
					</Route>
				)}
				<AuthenticatedAppContainer />
			</Switch>
		</Router>
	);
};
