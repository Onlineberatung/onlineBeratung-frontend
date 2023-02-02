import '../../polyfill';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ComponentType, useState, lazy, Suspense } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	RouteProps,
	Redirect
} from 'react-router-dom';
import { StageProps } from '../stage/stage';
import '../../resources/styles/styles';
import { ContextProvider } from '../../globalState/state';
import { WebsocketHandler } from './WebsocketHandler';
import ErrorBoundary from './ErrorBoundary';
import { LanguagesProvider } from '../../globalState/provider/LanguagesProvider';
import { TenantThemingLoader } from './TenantThemingLoader';
import {
	AppConfigInterface,
	AppConfigProvider,
	LegalLinkInterface,
	LocaleProvider,
	TenantProvider
} from '../../globalState';
import { LegalLinksProvider } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { DevToolbarWrapper } from '../devToolbar/DevToolbar';
import { PreConditions, preConditionsMet } from './PreConditions';
import { Loading } from './Loading';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';

const Login = lazy(() =>
	import('../login/Login').then((m) => ({ default: m.Login }))
);
const AuthenticatedApp = lazy(() =>
	import('./AuthenticatedApp').then((m) => ({ default: m.AuthenticatedApp }))
);
const Registration = lazy(() =>
	import('../registration/Registration').then((m) => ({
		default: m.Registration
	}))
);
const WaitingRoomLoader = lazy(() =>
	import('../waitingRoom/WaitingRoomLoader').then((m) => ({
		default: m.WaitingRoomLoader
	}))
);
const VideoConference = lazy(
	() => import('../videoConference/VideoConference')
);
const VideoCall = lazy(() => import('../videoCall/VideoCall'));

type RouteDefinition = {
	route: RouteProps;
	component: ComponentType;
};

interface AppPropsWhichAreUsedByEveryInstanceSoBeCarefull {
	stageComponent: ComponentType<StageProps>;
	legalLinks?: Array<LegalLinkInterface>;
	entryPoint: string;
	extraRoutes?: RouteDefinition[];
	spokenLanguages?: string[];
	fixedLanguages?: string[];
	config: AppConfigInterface;
}

export const App = ({
	stageComponent,
	legalLinks,
	entryPoint,
	extraRoutes: additionalRoutes = [],
	spokenLanguages = null,
	fixedLanguages = ['de'],
	config
}: AppPropsWhichAreUsedByEveryInstanceSoBeCarefull) => {
	// The login is possible both at the root URL as well as with an
	// optional resort name. Since resort names are dynamic, we have
	// to find out if the provided path is a resort name. If not, we
	// use the authenticated app as a catch-all fallback.

	return (
		<ErrorBoundary>
			<AppConfigProvider config={config}>
				<TenantProvider>
					<LocaleProvider>
						<LanguagesProvider
							fixed={fixedLanguages}
							spoken={spokenLanguages}
						>
							<LegalLinksProvider legalLinks={legalLinks}>
								<GlobalComponentContext.Provider
									value={{ Stage: stageComponent }}
								>
									<RouterWrapper
										additionalRoutes={additionalRoutes}
										entryPoint={entryPoint}
									/>
								</GlobalComponentContext.Provider>
							</LegalLinksProvider>
						</LanguagesProvider>
					</LocaleProvider>
				</TenantProvider>
				<DevToolbarWrapper />
			</AppConfigProvider>
		</ErrorBoundary>
	);
};

interface RouterWrapperProps {
	entryPoint: string;
	additionalRoutes?: RouteDefinition[];
}

const RouterWrapper = ({
	additionalRoutes,
	entryPoint
}: RouterWrapperProps) => {
	const history = useHistory();
	const redirectTo = history.push;
	const appConfig = useAppConfig();

	const [startWebsocket, setStartWebsocket] = useState<boolean>(false);
	const [disconnectWebsocket, setDisconnectWebsocket] =
		useState<boolean>(false);
	const [failedPreCondition, setFailedPreCondition] = useState(
		preConditionsMet()
	);

	if (failedPreCondition) {
		return <PreConditions onPreConditionsMet={setFailedPreCondition} />;
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
						<Suspense fallback={<Loading />}>
							<Switch>
								{/* all by configuration defined routes first to allow override of anything */}
								{additionalRoutes.map(
									({ route, component: Component }) => (
										<Route {...route}>
											<Component />
										</Route>
									)
								)}
								{/* protected routes next to allow override of unprotected routes */}
								<AuthenticatedApp
									onAppReady={() => setStartWebsocket(true)}
									onLogout={() =>
										setDisconnectWebsocket(true)
									}
								/>
								{/* last but not least: unprotected routes */}
								<Route
									path={[
										appConfig.routePaths?.registration ||
											'/registration',
										'/:consultingTypeSlug/registration'
									]}
								>
									<Registration
										handleUnmatchConsultingType={() =>
											redirectTo(
												appConfig.routePaths?.login ||
													'/login'
											)
										}
										handleUnmatchConsultant={() =>
											redirectTo(
												appConfig.routePaths?.login ||
													'/login'
											)
										}
									/>
								</Route>

								<Route path="/:consultingTypeSlug/warteraum">
									<WaitingRoomLoader
										handleUnmatch={() =>
											redirectTo(
												appConfig.routePaths?.login ||
													'/login'
											)
										}
										onAnonymousRegistration={() =>
											setStartWebsocket(true)
										}
									/>
								</Route>

								<Route
									path={
										appConfig.routePaths?.login || '/login'
									}
									exact
								>
									<Login />
								</Route>

								<Route
									path={appConfig.urls.videoConference}
									exact
								>
									<VideoConference />
								</Route>
								<Route path={appConfig.urls.videoCall} exact>
									<VideoCall />
								</Route>
							</Switch>
						</Suspense>
					</ContextProvider>
				</Route>
			</Switch>
		</Router>
	);
};
