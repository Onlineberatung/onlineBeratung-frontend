import '../../polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useContext, useEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { createBrowserHistory } from 'history';
import { Routing } from './Routing';
import { config } from '../../resources/scripts/config';
import {
	setTokenInCookie,
	getTokenFromCookie
} from '../sessionCookie/accessSessionCookie';
import {
	UserDataContext,
	UserDataInterface,
	AuthDataContext,
	AuthDataInterface,
	UnreadSessionsStatusContext
} from '../../globalState';
import { ContextProvider } from '../../globalState/state';
import { getUserData } from '../apiWrapper';
import { Loading } from './Loading';
import { handleTokenRefresh } from '../auth/auth';
import { logout } from '../logout/logout';
import '../../resources/styles/styles';
import './app.styles';
import './navigation.styles';
import './loading.styles';

export const history = createBrowserHistory();

export const initApp = () => {
	ReactDOM.render(<AppContainer />, document.getElementById('appRoot'));
};

export const AppContainer = (props) => {
	return (
		<ContextProvider>
			<App />
		</ContextProvider>
	);
};

const socket = new SockJS(config.endpoints.liveservice);
const stompClient = Stomp.over(socket);
// DEV-NOTE: comment next line to activate debug mode (stomp logging) for development
// stompClient.debug = null;

const STOMP_EVENT_TYPES = {
	DIRECT_MESSAGE: 'directMessage'
};

export const App: React.FC = () => {
	const { setAuthData } = useContext(AuthDataContext);
	const [authDataRequested, setAuthDataRequested] = useState(false);
	const { setUserData } = useContext(UserDataContext);
	const [appReady, setAppReady] = useState(false);
	const [userDataRequested, setUserDataRequested] = useState(false);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const [newStompDirectMessage, setNewStompDirectMessage] = useState(false);

	if (!authDataRequested) {
		setAuthDataRequested(true);
		const currentAuthData: AuthDataInterface = {
			keycloakRefreshToken: getTokenFromCookie('refreshToken'),
			keycloakToken: getTokenFromCookie('keycloak'),
			rocketchatToken: getTokenFromCookie('rc_token'),
			rocketchatUserId: getTokenFromCookie('rc_uid')
		};
		setAuthData(currentAuthData);
	}

	if (!userDataRequested) {
		setUserDataRequested(true);
		handleTokenRefresh().then(() => {
			getUserData()
				.then((userProfileData: UserDataInterface) => {
					// set informal / formal cookie depending on the given userdata
					setTokenInCookie(
						'useInformal',
						!userProfileData.formalLanguage ? '1' : ''
					);
					setUserData(userProfileData);
					setAppReady(true);
				})
				.catch((error) => {
					window.location.href = config.endpoints.logoutRedirect;
					console.log(error);
				});
		});
	}

	useEffect(() => {
		initLiveServiceSocket();
	}, [appReady]);

	useEffect(() => {
		if (newStompDirectMessage) {
			setUnreadSessionsStatus({
				...unreadSessionsStatus,
				mySessions: unreadSessionsStatus.mySessions + 1,
				newDirectMessage: true,
				resetedAnimations: unreadSessionsStatus.mySessions === 0
			});
			setNewStompDirectMessage(false);
		}
	}, [newStompDirectMessage]); // eslint-disable-line react-hooks/exhaustive-deps

	const initLiveServiceSocket = () => {
		stompClient.connect(
			{
				accessToken: getTokenFromCookie('keycloak')
			},
			(frame) => {
				console.log('Connected: ' + frame);
				stompClient.subscribe('/user/events', function (message) {
					const stompMessageBody = JSON.parse(message.body);
					const stompEventType = stompMessageBody['eventType'];
					if (stompEventType === STOMP_EVENT_TYPES.DIRECT_MESSAGE) {
						setNewStompDirectMessage(true);
					}
				});
			}
		);
		stompClient.onWebSocketClose = (message) => {
			console.log('Closed', message);
		};
		stompClient.onWebSocketError = (error) => {
			console.log('Error', error);
		};
	};

	const handleLogout = () => {
		if (stompClient) {
			stompClient.disconnect();
		}
		logout();
	};

	if (appReady) {
		return (
			<Router history={history}>
				<Routing logout={handleLogout} />
			</Router>
		);
	}

	return <Loading />;
};
