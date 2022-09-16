import '../../polyfill';
import * as React from 'react';
import {
	ComponentType,
	ReactNode,
	useCallback,
	useEffect,
	useState
} from 'react';
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
import { LanguagesContext } from '../../globalState/provider/LanguagesProvider';
import { TenantThemingLoader } from './TenantThemingLoader';
import { LegalLinkInterface, useAppConfigContext } from '../../globalState';
import VideoConference from '../videoConference/VideoConference';
import { config } from '../../resources/scripts/config';
import { useTranslation } from 'react-i18next';
import VideoCall from '../videoCall/VideoCall';
import { LegalLinksProvider } from '../../globalState/provider/LegalLinksProvider';
import { apiGetTenantTheming } from '../../api/apiGetTenantTheming';
import getLocationVariables from '../../utils/getLocationVariables';
import { apiServerSettings } from '../../api/apiServerSettings';

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
}

export const App = ({
	stageComponent,
	legalLinks,
	entryPoint,
	extraRoutes = [],
	spokenLanguages = config.spokenLanguages,
	fixedLanguages = ['de']
}: AppProps) => {
	const { t: translate } = useTranslation();
	const sortByTranslation = (a, b) => {
		if (translate(`languages.${a}`) === translate(`languages.${b}`)) {
			return 0;
		}
		return translate(`languages.${a}`) > translate(`languages.${b}`)
			? 1
			: -1;
	};

	const { settings, setServerSettings } = useAppConfigContext();
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
	const [
		hasUnmatchedRegistrationConsultant,
		setHasUnmatchedRegistrationConsultant
	] = useState(false);
	const [startWebsocket, setStartWebsocket] = useState<boolean>(false);
	const [disconnectWebsocket, setDisconnectWebsocket] =
		useState<boolean>(false);

	const { subdomain } = getLocationVariables();

	const loginBudiBase = useCallback((featureToolsOICDToken: string) => {
		const ifrm = document.createElement('iframe');
		ifrm.setAttribute(
			'src',
			`${config.urls.budibaseDevServer}/api/global/auth/default/oidc/configs/${featureToolsOICDToken}`
		);
		ifrm.id = 'authIframe2';
		ifrm.style.display = 'none';
		document.body.appendChild(ifrm);
		setTimeout(() => {
			document.querySelector('#authIframe2').remove();
		}, 5000);
	}, []);

	useEffect(() => {
		apiGetTenantTheming({
			subdomain,
			useMultiTenancyWithSingleDomain:
				settings?.multitenancyWithSingleDomainEnabled,
			mainTenantSubdomainForSingleDomain:
				settings.mainTenantSubdomainForSingleDomainMultitenancy
		}).then((resp) => {
			if (resp.settings.featureToolsEnabled) {
				loginBudiBase(resp.settings.featureToolsOICDToken);
			}
		});
	}, []); // eslint-disable-line

	useEffect(() => {
		settings.useApiClusterSettings &&
			apiServerSettings().then((serverSettings) => {
				setServerSettings(serverSettings || {});
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ErrorBoundary>
			<Router>
				<Switch>
					{entryPoint !== '/' && (
						<Redirect from="/" to={entryPoint} exact />
					)}
					<Route>
						<LegalLinksProvider legalLinks={legalLinks}>
							<LanguagesContext.Provider
								value={{
									fixed: fixedLanguages,
									spoken: spokenLanguages
										.slice()
										.sort(sortByTranslation)
								}}
							>
								<ContextProvider>
									<TenantThemingLoader />
									{startWebsocket && (
										<WebsocketHandler
											disconnect={disconnectWebsocket}
										/>
									)}
									<Switch>
										{extraRoutes.map(
											({
												route,
												component: Component
											}) => (
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
														stageComponent={
															stageComponent
														}
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
												path={[
													'/login',
													'/:consultingTypeSlug'
												]}
												exact
											>
												<LoginLoader
													handleUnmatch={() =>
														setHasUnmatchedLoginConsultingType(
															true
														)
													}
													stageComponent={
														stageComponent
													}
												/>
											</Route>
										)}
										<Route
											path={config.urls.videoConference}
											exact
										>
											<VideoConference />
										</Route>
										<Route
											path={config.urls.videoCall}
											exact
										>
											<VideoCall />
										</Route>
										<AuthenticatedApp
											onAppReady={() =>
												setStartWebsocket(true)
											}
											onLogout={() =>
												setDisconnectWebsocket(true)
											}
										/>
									</Switch>
								</ContextProvider>
							</LanguagesContext.Provider>
						</LegalLinksProvider>
					</Route>
				</Switch>
			</Router>
		</ErrorBoundary>
	);
};
