import * as React from 'react';
import { config } from '../../resources/scripts/config';
import { Stomp } from '@stomp/stompjs';
import useConstant from 'use-constant';
import * as SockJS from 'sockjs-client';
import { getTokenFromCookie } from '../sessionCookie/accessSessionCookie';
import { useContext, useEffect, useState } from 'react';
import {
	IncomingVideoCallProps,
	VideoCallRequestProps
} from '../incomingVideoCall/IncomingVideoCall';
import {
	NotificationsContext,
	UnreadSessionsStatusContext
} from '../../globalState';

const STOMP_EVENT_TYPES = {
	DIRECT_MESSAGE: 'directMessage',
	VIDEO_CALL_REQUEST: 'videoCallRequest',
	ANONYMOUS_ENQUIRY_ACCEPTED: 'anonymousEnquiryAccepted'
};

interface WebsocketHandlerProps {
	disconnect: boolean;
}

export const WebsocketHandler = ({ disconnect }: WebsocketHandlerProps) => {
	const [newStompDirectMessage, setNewStompDirectMessage] = useState<boolean>(
		false
	);
	const [newStompVideoCallRequest, setNewStompVideoCallRequest] = useState<
		VideoCallRequestProps
	>();
	const { unreadSessionsStatus, setUnreadSessionsStatus } = useContext(
		UnreadSessionsStatusContext
	);
	const { notifications, setNotifications } = useContext(
		NotificationsContext
	);

	// Init live service socket
	const stompClient = useConstant(() => {
		const socket = new SockJS(config.endpoints.liveservice);
		const client = Stomp.over(socket);

		// DEV-NOTE: comment next line to activate debug mode (stomp logging) for development
		client.debug = () => {};
		return client;
	});

	useEffect(() => {
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
					} else if (
						stompEventType ===
						STOMP_EVENT_TYPES.ANONYMOUS_ENQUIRY_ACCEPTED
					) {
						//TODO: REDIRECT TO 1:1 LIVE CHAT
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
	}, [stompClient]);

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

	return <></>;
};
