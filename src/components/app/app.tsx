import '../../polyfill';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ComponentType, useState } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	RouteProps,
	Redirect
} from 'react-router-dom';
import { AuthenticatedApp } from './AuthenticatedApp';
import { Registration } from '../registration/Registration';
import { StageProps } from '../stage/stage';
import '../../resources/styles/styles';
import { WaitingRoomLoader } from '../waitingRoom/WaitingRoomLoader';
import { ContextProvider } from '../../globalState/state';
import { WebsocketHandler } from './WebsocketHandler';
import ErrorBoundary from './ErrorBoundary';
import { LanguagesProvider } from '../../globalState/provider/LanguagesProvider';
import { TenantThemingLoader } from './TenantThemingLoader';
import {
	AppConfigInterface,
	AppConfigProvider,
	LegalLinkInterface,
	LocaleProvider
} from '../../globalState';
import VideoConference from '../videoConference/VideoConference';
import VideoCall from '../videoCall/VideoCall';
import { LegalLinksProvider } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { DevToolbarWrapper } from '../devToolbar/DevToolbar';
import { Login } from '../login/Login';
import { PreConditions, preConditionsMet } from './PreConditions';

type TExtraRoute = {
	route: RouteProps;
	component: ComponentType;
};

interface AppProps {
	stageComponent: ComponentType<StageProps>;
	legalLinks?: Array<LegalLinkInterface>;
	entryPoint: string;
	extraRoutes?: TExtraRoute[];
	spokenLanguages?: string[];
	fixedLanguages?: string[];
	config: AppConfigInterface;
}

export const App = ({
	stageComponent,
	legalLinks,
	entryPoint,
	extraRoutes = [],
	spokenLanguages = null,
	fixedLanguages = ['de'],
	config
}: AppProps) => {
	// The login is possible both at the root URL as well as with an
	// optional resort name. Since resort names are dynamic, we have
	// to find out if the provided path is a resort name. If not, we
	// use the authenticated app as a catch-all fallback.

	return (
		<ErrorBoundary>
			<AppConfigProvider config={config}>
				<LocaleProvider>
					<LanguagesProvider
						fixed={fixedLanguages}
						spoken={spokenLanguages}
					>
						<LegalLinksProvider legalLinks={legalLinks}>
							<RouterWrapper
								stageComponent={stageComponent}
								extraRoutes={extraRoutes}
								entryPoint={entryPoint}
							/>
						</LegalLinksProvider>
					</LanguagesProvider>
				</LocaleProvider>
				<DevToolbarWrapper />
			</AppConfigProvider>
		</ErrorBoundary>
	);
};

interface RouterWrapperProps {
	stageComponent: ComponentType<StageProps>;
	entryPoint: string;
	extraRoutes?: TExtraRoute[];
}

const RouterWrapper = ({
	extraRoutes,
	stageComponent,
	entryPoint
}: RouterWrapperProps) => {
	const history = useHistory();
	const settings = useAppConfig();

	const [startWebsocket, setStartWebsocket] = useState<boolean>(false);
	const [disconnectWebsocket, setDisconnectWebsocket] =
		useState<boolean>(false);
	const [failedPreCondition, setFailedPreCondition] = useState(
		preConditionsMet()
	);

	if (failedPreCondition) {
		return (
			<PreConditions
				stageComponent={stageComponent}
				onPreConditionsMet={setFailedPreCondition}
			/>
		);
	}

	return (
		<Router>
			<Switch>
				{entryPoint !== '/' && (
					<Redirect from="/" to={entryPoint} exact />
				)}
				<Route>
					<ContextProvider>
						<TenantThemingLoader />
						{startWebsocket && (
							<WebsocketHandler
								disconnect={disconnectWebsocket}
							/>
						)}
						<Switch>
							{extraRoutes.map(
								({ route, component: Component }) => (
									<Route {...route}>
										<Component />
									</Route>
								)
							)}

							<Route
								path={[
									'/registration',
									'/:consultingTypeSlug/registration'
								]}
							>
								<Registration
									handleUnmatchConsultingType={() =>
										history.push('/login')
									}
									handleUnmatchConsultant={() =>
										history.push('/login')
									}
									stageComponent={stageComponent}
								/>
							</Route>

							<Route path="/:consultingTypeSlug/warteraum">
								<WaitingRoomLoader
									handleUnmatch={() => history.push('/login')}
									onAnonymousRegistration={() =>
										setStartWebsocket(true)
									}
								/>
							</Route>

							<Route path="/login" exact>
								<Login stageComponent={stageComponent} />
							</Route>
							<Route path={settings.urls.videoConference} exact>
								<VideoConference />
							</Route>
							<Route path={settings.urls.videoCall} exact>
								<VideoCall />
							</Route>
							<AuthenticatedApp
								onAppReady={() => setStartWebsocket(true)}
								onLogout={() => setDisconnectWebsocket(true)}
							/>
						</Switch>
					</ContextProvider>
				</Route>
			</Switch>
		</Router>
	);
};
