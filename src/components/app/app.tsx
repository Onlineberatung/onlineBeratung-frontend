import '../../polyfill';
import * as React from 'react';
import { ComponentType, ReactNode, useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthenticatedApp } from './AuthenticatedApp';
import { Registration } from '../registration/Registration';
import { LoginLoader } from './LoginLoader';
import { StageProps } from '../stage/stage';
import '../../resources/styles/styles';
import { WaitingRoomLoader } from '../waitingRoom/WaitingRoomLoader';
import { ContextProvider } from '../../globalState/state';
import { WebsocketHandler } from './WebsocketHandler';
import { LegalInformationLinksProps } from '../login/LegalInformationLinks';

export const history = createBrowserHistory();

interface AppProps {
	stageComponent: ComponentType<StageProps>;
	legalComponent: ComponentType<LegalInformationLinksProps>;
	extraRoutes?: ReactNode;
}

export const App = ({
	stageComponent,
	extraRoutes,
	legalComponent
}: AppProps) => {
	// The login is possible both at the root URL as well as with an
	// optional resort name. Since resort names are dynamic, we have
	// to find out if the provided path is a resort name. If not, we
	// use the authenticated app as a catch-all fallback.
	const [
		hasUnmatchedLoginConsultingType,
		setHasUnmatchedLoginConsultingType
	] = useState(false);
	const [
		hasUnmatchedAnonymousConversation,
		setHasUnmatchedAnonymousConversation
	] = useState(false);
	const [
		hasUnmatchedRegistrationConsultingType,
		setHasUnmatchedRegistrationConsultingType
	] = useState(false);
	const [startWebsocket, setStartWebsocket] = useState<boolean>(false);
	const [disconnectWebsocket, setDisconnectWebsocket] =
		useState<boolean>(false);

	return (
		<Router history={history}>
			<ContextProvider>
				{startWebsocket && (
					<WebsocketHandler disconnect={disconnectWebsocket} />
				)}
				<Switch>
					{extraRoutes}
					{!hasUnmatchedRegistrationConsultingType && (
						<Route path="/:consultingTypeSlug/registration">
							<Registration
								handleUnmatch={() =>
									setHasUnmatchedRegistrationConsultingType(
										true
									)
								}
								stageComponent={stageComponent}
								legalComponent={legalComponent}
							/>
						</Route>
					)}
					{!hasUnmatchedAnonymousConversation && (
						<Route path="/:consultingTypeSlug/warteraum">
							<WaitingRoomLoader
								handleUnmatch={() =>
									setHasUnmatchedAnonymousConversation(true)
								}
								onAnonymousRegistration={() =>
									setStartWebsocket(true)
								}
							/>
						</Route>
					)}
					{!hasUnmatchedLoginConsultingType && (
						<Route path="/:consultingTypeSlug">
							<LoginLoader
								handleUnmatch={() =>
									setHasUnmatchedLoginConsultingType(true)
								}
								stageComponent={stageComponent}
								legalComponent={legalComponent}
							/>
						</Route>
					)}
					<AuthenticatedApp
						onAppReady={() => setStartWebsocket(true)}
						onLogout={() => setDisconnectWebsocket(true)}
						legalComponent={legalComponent}
					/>
				</Switch>
			</ContextProvider>
		</Router>
	);
};
