import '../../polyfill';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ComponentType, useState, lazy, Suspense, useContext } from 'react';
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
	AppConfigProvider,
	InformalProvider,
	LocaleProvider,
	NotificationsContext,
	TenantProvider
} from '../../globalState';
import {
	AppConfigInterface,
	LegalLinkInterface
} from '../../globalState/interfaces';
import { LegalLinksProvider } from '../../globalState/provider/LegalLinksProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { DevToolbarWrapper } from '../devToolbar/DevToolbar';
import { PreConditions, preConditionsMet } from './PreConditions';
import { Loading } from './Loading';
import { GlobalComponentContext } from '../../globalState/provider/GlobalComponentContext';
import { UrlParamsProvider } from '../../globalState/provider/UrlParamsProvider';
import { Notifications } from '../notifications/Notifications';

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

type TExtraRoute = {
	route: RouteProps;
	component: ComponentType;
};

interface AppProps {
	stageComponent: ComponentType<StageProps>;
	legalLinks?: Array<LegalLinkInterface>;
	extraRoutes?: TExtraRoute[];
	spokenLanguages?: string[];
	fixedLanguages?: string[];
	config: AppConfigInterface;
}

export const App = ({
	stageComponent,
	legalLinks,
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
				<TenantProvider>
					<InformalProvider>
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
											extraRoutes={extraRoutes}
										/>
									</GlobalComponentContext.Provider>
								</LegalLinksProvider>
							</LanguagesProvider>
						</LocaleProvider>
					</InformalProvider>
				</TenantProvider>
				<DevToolbarWrapper />
			</AppConfigProvider>
		</ErrorBoundary>
	);
};

interface RouterWrapperProps {
	extraRoutes?: TExtraRoute[];
}

const RouterWrapper = ({ extraRoutes }: RouterWrapperProps) => {
	const history = useHistory();
	const settings = useAppConfig();

	const [startWebsocket, setStartWebsocket] = useState<boolean>(false);
	const [disconnectWebsocket, setDisconnectWebsocket] =
		useState<boolean>(false);
	const [failedPreCondition, setFailedPreCondition] =
		useState(preConditionsMet());

	if (failedPreCondition) {
		return <PreConditions onPreConditionsMet={setFailedPreCondition} />;
	}

	return (
		<Router>
			<Switch>
				{settings.urls.landingpage !== '/' && (
					<Redirect from="/" to={settings.urls.landingpage} exact />
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
								{extraRoutes.map(
									({ route, component: Component }) => (
										<Route
											{...route}
											key={
												typeof route.path === 'string'
													? route.path
													: route.path.join('-')
											}
										>
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
									<UrlParamsProvider>
										<Registration
											handleUnmatchConsultingType={() =>
												history.push('/login')
											}
											handleUnmatchConsultant={() =>
												history.push('/login')
											}
										/>
									</UrlParamsProvider>
								</Route>

								<Route path="/:consultingTypeSlug/warteraum">
									<WaitingRoomLoader
										handleUnmatch={() =>
											history.push('/login')
										}
										onAnonymousRegistration={() =>
											setStartWebsocket(true)
										}
									/>
								</Route>

								<Route path="/login" exact>
									<UrlParamsProvider>
										<Login />
									</UrlParamsProvider>
								</Route>
								<Route
									path={settings.urls.videoConference}
									exact
								>
									<VideoConference />
								</Route>
								<Route path={settings.urls.videoCall} exact>
									<VideoCall />
								</Route>
								<AuthenticatedApp
									onAppReady={() => setStartWebsocket(true)}
									onLogout={() =>
										setDisconnectWebsocket(true)
									}
								/>
							</Switch>
							<NotificationsContainer />
						</Suspense>
					</ContextProvider>
				</Route>
			</Switch>
		</Router>
	);
};

const NotificationsContainer = () => {
	const { notifications } = useContext(NotificationsContext);
	return (
		notifications.length > 0 && (
			<Notifications notifications={notifications} />
		)
	);
};
