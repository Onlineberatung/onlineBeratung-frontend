import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
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
	UnreadSessionsStatusContext,
	NotificationsContext
} from '../../globalState';
import { ContextProvider } from '../../globalState/state';
import { apiGetUserData } from '../../api';
import { Loading } from './Loading';
import { handleTokenRefresh } from '../auth/auth';
import { logout } from '../logout/logout';
import { Notifications } from '../notifications/Notifications';
import {
	IncomingVideoCallProps,
	VideoCallRequestProps
} from '../incomingVideoCall/IncomingVideoCall';
import './app.styles';
import './navigation.styles';

export const AuthenticatedAppContainer = (props) => {
	return (
		<ContextProvider>
			<App />
		</ContextProvider>
	);
};

const socket = new SockJS(config.endpoints.liveservice);
const stompClient = Stomp.over(socket);
// DEV-NOTE: comment next line to activate debug mode (stomp logging) for development
stompClient.debug = () => {};

const STOMP_EVENT_TYPES = {
	DIRECT_MESSAGE: 'directMessage',
	VIDEO_CALL_REQUEST: 'videoCallRequest'
};

export const App: React.FC = () => {
	const { setAuthData } = useContext(AuthDataContext);
	const [authDataRequested, setAuthDataRequested] = useState<boolean>(false);
	const { setUserData } = useContext(UserDataContext);
	const [appReady, setAppReady] = useState<boolean>(false);
	const [userDataRequested, setUserDataRequested] = useState<boolean>(false);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const [newStompDirectMessage, setNewStompDirectMessage] = useState<boolean>(
		false
	);
	const [newStompVideoCallRequest, setNewStompVideoCallRequest] = useState<
		VideoCallRequestProps
	>();
	const { notifications, setNotifications } = useContext(
		NotificationsContext
	);

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
			apiGetUserData()
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
					window.location.href = config.urls.toLogin;
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

	useEffect(() => {
		if (newStompVideoCallRequest) {
			const requestedRoomAlreadyHasActiveVideoCall = notifications.some(
				(notification) =>
					notification.videoCall.rcGroupId ===
					newStompVideoCallRequest.rcGroupId
			);
			if (!requestedRoomAlreadyHasActiveVideoCall) {
				const newNotification: IncomingVideoCallProps = {
					notificationType: 'call',
					videoCall: newStompVideoCallRequest
				};
				setNotifications([...notifications, newNotification]);
			}
		}
	}, [newStompVideoCallRequest]); // eslint-disable-line react-hooks/exhaustive-deps

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
					} else if (
						stompEventType === STOMP_EVENT_TYPES.VIDEO_CALL_REQUEST
					) {
						const stompEventContent: VideoCallRequestProps =
							stompMessageBody['eventContent'];
						setNewStompVideoCallRequest(stompEventContent);
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
			<>
				<Routing logout={handleLogout} />
				{notifications && (
					<Notifications notifications={notifications} />
				)}
			</>
		);
	}

	return <Loading />;
};
