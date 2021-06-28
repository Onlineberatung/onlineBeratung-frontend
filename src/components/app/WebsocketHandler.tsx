import * as React from 'react';
import { config } from '../../resources/scripts/config';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { useContext, useEffect, useState } from 'react';
import {
	IncomingVideoCallProps,
	VideoCallRequestProps
} from '../incomingVideoCall/IncomingVideoCall';
import {
	AnonymousConversationFinishedContext,
	AnonymousEnquiryAcceptedContext,
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	UnreadSessionsStatusContext,
	UpdateAnonymousEnquiriesContext,
	UpdateSessionListContext,
	UserDataContext,
	WebsocketConnectionDeactivatedContext
} from '../../globalState';

interface WebsocketHandlerProps {
	disconnect: boolean;
}

export const WebsocketHandler = ({ disconnect }: WebsocketHandlerProps) => {
	const [newStompDirectMessage, setNewStompDirectMessage] = useState<boolean>(
		false
	);
	const [newStompAnonymousEnquiry, setNewStompAnonymousEnquiry] = useState<
		boolean
	>(false);
	const [newStompVideoCallRequest, setNewStompVideoCallRequest] = useState<
		VideoCallRequestProps
	>();
	const { userData } = useContext(UserDataContext);
	const [
		newStompAnonymousChatFinished,
		setNewStompAnonymousChatFinished
	] = useState<boolean>(false);
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const { setUpdateAnonymousEnquiries } = useContext(
		UpdateAnonymousEnquiriesContext
	);
	const { setUpdateSessionList } = useContext(UpdateSessionListContext);
	const { notifications, setNotifications } = useContext(
		NotificationsContext
	);
	const { setAnonymousEnquiryAccepted } = useContext(
		AnonymousEnquiryAcceptedContext
	);
	const { setAnonymousConversationFinished } = useContext(
		AnonymousConversationFinishedContext
	);
	const { setWebsocketConnectionDeactivated } = useContext(
		WebsocketConnectionDeactivatedContext
	);

	const stompClient = Stomp.over(function () {
		return new SockJS(config.endpoints.liveservice);
	});
	let reconnectAttemptCount = 0;
	const RECONNECT_ATTEMPT_LIMIT = 10;
	const RECONNECT_DELAY = 5000;

	useEffect(() => {
		stompClient.beforeConnect = () => {
			stompClient.connectHeaders = {
				accessToken: getValueFromCookie('keycloak')
			};
			reconnectAttemptCount++;

			if (reconnectAttemptCount >= RECONNECT_ATTEMPT_LIMIT) {
				stompClient.deactivate();
				setWebsocketConnectionDeactivated(true);
			}
		};

		stompConnect();

		stompClient.onWebSocketClose = (message) => {
			console.log('Closed', message);
		};

		stompClient.onWebSocketError = (error) => {
			console.log('Error', error);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (disconnect) {
			stompClient?.disconnect();
		}
	}, [stompClient, disconnect]);

	useEffect(() => {
		if (newStompDirectMessage) {
			setUnreadSessionsStatus({
				...unreadSessionsStatus,
				mySessions: unreadSessionsStatus.mySessions + 1,
				newDirectMessage: true,
				resetedAnimations: unreadSessionsStatus.mySessions === 0
			});
			setUpdateSessionList(true);
			setNewStompDirectMessage(false);
		}
	}, [newStompDirectMessage]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (newStompAnonymousEnquiry) {
			setUpdateAnonymousEnquiries(true);
			setNewStompAnonymousEnquiry(false);
		}
	}, [newStompAnonymousEnquiry]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (newStompAnonymousChatFinished) {
			if (
				userData &&
				hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData)
			) {
				setUpdateSessionList(true);
			}
			setNewStompAnonymousChatFinished(false);
		}
	}, [newStompAnonymousChatFinished]); // eslint-disable-line react-hooks/exhaustive-deps

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

	const stompConnect = () => {
		stompClient.reconnect_delay = RECONNECT_DELAY;
		stompClient.connect({}, (frame) => {
			console.log('Connected: ' + frame);
			reconnectAttemptCount = 0;
			stompClient.subscribe('/user/events', function (message) {
				const stompMessageBody = JSON.parse(message.body);
				const stompEventType: LiveService.Schemas.EventType =
					stompMessageBody['eventType'];
				if (stompEventType === 'directMessage') {
					setNewStompDirectMessage(true);
				} else if (stompEventType === 'newAnonymousEnquiry') {
					setNewStompAnonymousEnquiry(true);
				} else if (stompEventType === 'videoCallRequest') {
					const stompEventContent: VideoCallRequestProps =
						stompMessageBody['eventContent'];
					setNewStompVideoCallRequest(stompEventContent);
				} else if (stompEventType === 'anonymousEnquiryAccepted') {
					setAnonymousEnquiryAccepted(true);
				} else if (stompEventType === 'anonymousConversationFinished') {
					const finishConversationPhase =
						stompMessageBody.eventContent?.finishConversationPhase;
					setAnonymousConversationFinished(finishConversationPhase);
					setNewStompAnonymousChatFinished(true);
				}
				message.ack({ 'message-id': message.headers.id });
			});
		});
	};

	return <></>;
};
