import '../../polyfill';
import * as React from 'react';
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
import { LoginLoader } from './LoginLoader';
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
			</AppConfigProvider>
			<DevToolbarWrapper />
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
	const settings = useAppConfig();

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
	const [
		hasUnmatchedRegistrationConsultant,
		setHasUnmatchedRegistrationConsultant
	] = useState(false);
	const [startWebsocket, setStartWebsocket] = useState<boolean>(false);
	const [disconnectWebsocket, setDisconnectWebsocket] =
		useState<boolean>(false);

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

							{!hasUnmatchedRegistrationConsultingType &&
								!hasUnmatchedRegistrationConsultant && (
									<Route
										path={[
											'/registration',
											'/:consultingTypeSlug/registration'
										]}
									>
										<Registration
											handleUnmatchConsultingType={() =>
												setHasUnmatchedRegistrationConsultingType(
													true
												)
											}
											handleUnmatchConsultant={() => {
												setHasUnmatchedRegistrationConsultant(
													true
												);
											}}
											stageComponent={stageComponent}
										/>
									</Route>
								)}

							{!hasUnmatchedAnonymousConversation && (
								<Route path="/:consultingTypeSlug/warteraum">
									<WaitingRoomLoader
										handleUnmatch={() =>
											setHasUnmatchedAnonymousConversation(
												true
											)
										}
										onAnonymousRegistration={() =>
											setStartWebsocket(true)
										}
									/>
								</Route>
							)}

							{!hasUnmatchedLoginConsultingType && (
								<Route
									path={['/login', '/:consultingTypeSlug']}
									exact
								>
									<LoginLoader
										handleUnmatch={() =>
											setHasUnmatchedLoginConsultingType(
												true
											)
										}
										stageComponent={stageComponent}
									/>
								</Route>
							)}
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
