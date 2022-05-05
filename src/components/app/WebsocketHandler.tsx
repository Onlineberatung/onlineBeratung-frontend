import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { config } from '../../resources/scripts/config';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { translate } from '../../utils/translate';
import {
	NOTIFICATION_TYPE_CALL,
	VideoCallRequestProps
} from '../incomingVideoCall/IncomingVideoCall';
import {
	AnonymousConversationFinishedContext,
	AnonymousEnquiryAcceptedContext,
	NotificationsContext,
	WebsocketConnectionDeactivatedContext
} from '../../globalState';
import { SESSION_LIST_TAB_ANONYMOUS } from '../session/sessionHelpers';
import { sendNotification } from '../../utils/notificationHelpers';
import { history } from '../app/app';

interface WebsocketHandlerProps {
	disconnect: boolean;
}

export const WebsocketHandler = ({ disconnect }: WebsocketHandlerProps) => {
	const [newStompDirectMessage, setNewStompDirectMessage] =
		useState<boolean>(false);
	const [newStompAnonymousEnquiry, setNewStompAnonymousEnquiry] =
		useState<boolean>(false);
	const [newStompVideoCallRequest, setNewStompVideoCallRequest] =
		useState<VideoCallRequestProps>();
	const [newStompAnonymousChatFinished, setNewStompAnonymousChatFinished] =
		useState<boolean>(false);
	const { addNotification } = useContext(NotificationsContext);
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
	const RECONNECT_ATTEMPT_LIMIT = 2;
	const RECONNECT_DELAY = 5000;

	// DEV-NOTE: comment next line to activate debug mode (stomp logging) for development
	stompClient.debug = () => {};

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

		stompClient.onConnect = () => {};

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
			setNewStompDirectMessage(false);

			// ToDo: Move to new implementation
			sendNotification(translate('notifications.message.new'), {
				onclick: () => {
					history.push(
						`/sessions/consultant/sessionPreview?sessionListTab=${SESSION_LIST_TAB_ANONYMOUS}`
					);
				}
			});
		}
	}, [newStompDirectMessage]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (newStompAnonymousEnquiry) {
			setNewStompAnonymousEnquiry(false);

			sendNotification(translate('notifications.enquiry.new'), {
				showAlways: true,
				onclick: () => {
					history.push(
						`/sessions/consultant/sessionPreview?sessionListTab=${SESSION_LIST_TAB_ANONYMOUS}`
					);
				}
			});
		}
	}, [newStompAnonymousEnquiry]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (newStompAnonymousChatFinished) {
			setNewStompAnonymousChatFinished(false);
		}
	}, [newStompAnonymousChatFinished]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (newStompVideoCallRequest) {
			addNotification({
				id: newStompVideoCallRequest.rcGroupId,
				notificationType: NOTIFICATION_TYPE_CALL,
				videoCall: newStompVideoCallRequest
			});
		}
	}, [newStompVideoCallRequest]); // eslint-disable-line react-hooks/exhaustive-deps

	const stompConnect = () => {
		stompClient.reconnect_delay = RECONNECT_DELAY;
		stompClient.connect({}, (frame) => {
			reconnectAttemptCount = 0;
			stompClient.subscribe('/user/events', function (message) {
				const stompMessageBody = JSON.parse(message.body);
				const stompEventType: LiveService.Schemas.EventType =
					stompMessageBody['eventType'];
				if (stompEventType === 'directMessage') {
					setNewStompDirectMessage(true);
				} else if (stompEventType === 'videoCallRequest') {
					const stompEventContent: VideoCallRequestProps =
						stompMessageBody['eventContent'];
					setNewStompVideoCallRequest(stompEventContent);
				} else if (stompEventType === 'newAnonymousEnquiry') {
					setNewStompAnonymousEnquiry(true);
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
