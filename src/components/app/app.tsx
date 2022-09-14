import '../../polyfill';
import * as React from 'react';
import {
	ComponentType,
	ReactNode,
	useCallback,
	useEffect,
	useState
} from 'react';
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
import ErrorBoundary from './ErrorBoundary';
import { languageIsoCodesSortedByName } from '../../resources/scripts/i18n/de/languages';
import { FixedLanguagesContext } from '../../globalState/provider/FixedLanguagesProvider';
import { TenantThemingLoader } from './TenantThemingLoader';
import { LegalLinkInterface, useAppConfigContext } from '../../globalState';
import VideoConference from '../videoConference/VideoConference';
import { config } from '../../resources/scripts/config';
import { apiGetTenantTheming } from '../../api/apiGetTenantTheming';
import getLocationVariables from '../../utils/getLocationVariables';
import { apiServerSettings } from '../../api/apiServerSettings';

export const history = createBrowserHistory();

interface AppProps {
	stageComponent: ComponentType<StageProps>;
	legalLinks: Array<LegalLinkInterface>;
	entryPoint: string;
	extraRoutes?: ReactNode;
	spokenLanguages?: string[];
	fixedLanguages?: string[];
}

export const App = ({
	stageComponent,
	legalLinks,
	entryPoint,
	extraRoutes,
	spokenLanguages = languageIsoCodesSortedByName,
	fixedLanguages = ['de']
}: AppProps) => {
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
	const [isInitiallyLoaded, setIsInitiallyLoaded] = useState<boolean>(false);

	const activateInitialRedirect = () => {
		setIsInitiallyLoaded(true);
		history.push(entryPoint);
	};
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
		if (!isInitiallyLoaded && window.location.pathname === '/') {
			activateInitialRedirect();
		} else {
			setIsInitiallyLoaded(true);
			apiGetTenantTheming({
				subdomain,
				useMultiTenancyWithSingleDomain:
					settings?.multiTenancyWithSingleDomainEnabled,
				mainTenantSubdomainForSingleDomain:
					settings.mainTenantSubdomainForSingleDomainMultitenancy
			}).then((resp) => {
				if (resp.settings.featureToolsEnabled) {
					loginBudiBase(resp.settings.featureToolsOICDToken);
				}
			});
		}
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
			<Router history={history}>
				<FixedLanguagesContext.Provider value={fixedLanguages}>
					<ContextProvider>
						<TenantThemingLoader />
						{startWebsocket && (
							<WebsocketHandler
								disconnect={disconnectWebsocket}
							/>
						)}
						<Switch>
							{extraRoutes}

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
											legalLinks={legalLinks}
											stageComponent={stageComponent}
										/>
									</Route>
								)}

							{!hasUnmatchedAnonymousConversation && (
								<Route path="/:consultingTypeSlug/warteraum">
									<WaitingRoomLoader
										legalLinks={legalLinks}
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
										legalLinks={legalLinks}
										stageComponent={stageComponent}
									/>
								</Route>
							)}
							<Route path={config.urls.videoConference} exact>
								<VideoConference legalLinks={legalLinks} />
							</Route>
							{isInitiallyLoaded && (
								<AuthenticatedApp
									legalLinks={legalLinks}
									spokenLanguages={spokenLanguages}
									onAppReady={() => setStartWebsocket(true)}
									onLogout={() =>
										setDisconnectWebsocket(true)
									}
								/>
							)}
						</Switch>
					</ContextProvider>
				</FixedLanguagesContext.Provider>
			</Router>
		</ErrorBoundary>
	);
};
