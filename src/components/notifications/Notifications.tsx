import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import {
	IncomingVideoCall,
	IncomingVideoCallProps,
	isNotificationTypeCall,
	NOTIFICATION_TYPE_CALL
} from '../incomingVideoCall/IncomingVideoCall';
import './notifications.styles';
import incomingCallRingtone from '../../resources/audio/incomingCall.mp3';
import {
	NOTIFICATION_TYPE_INFO,
	NOTIFICATION_TYPE_SUCCESS,
	NOTIFICATION_TYPE_WARNING,
	NotificationDefaultType,
	NotificationsContext,
	NotificationType
} from '../../globalState';

type NotificationsProps = {
	notifications: NotificationType[];
};

export const Notifications = (props: NotificationsProps) => {
	const hasIncomingVideoCall: boolean = props.notifications.some(
		isNotificationTypeCall
	);

	return (
		<div className="notifications" data-cy="notifications">
			{props.notifications.map(
				(notification: NotificationType, index) => (
					<Notification
						notification={notification}
						key={notification.id}
					/>
				)
			)}
			{hasIncomingVideoCall && (
				<audio loop autoPlay data-cy="incoming-video-call-audio">
					<source src={incomingCallRingtone}></source>
				</audio>
			)}
		</div>
	);
};

type NotificationProps = {
	notification: NotificationType;
};

const Notification = ({ notification }: NotificationProps) => {
	switch (notification.notificationType) {
		case NOTIFICATION_TYPE_CALL:
			return (
				<IncomingVideoCall
					{...(notification as IncomingVideoCallProps)}
				/>
			);
		case NOTIFICATION_TYPE_INFO:
		case NOTIFICATION_TYPE_WARNING:
		case NOTIFICATION_TYPE_SUCCESS:
			return (
				<NotificationDefault
					notification={notification as NotificationDefaultType}
				/>
			);
	}
	return null;
};

const NotificationDefault = ({
	notification
}: {
	notification: NotificationDefaultType;
}) => {
	const { removeNotification } = useContext(NotificationsContext);

	const removeNotificationRef = useRef(removeNotification);
	const timer = useRef(null);

	useEffect(() => {
		removeNotificationRef.current = removeNotification;
	}, [removeNotification]);

	useEffect(() => {
		if (!timer.current && notification.timeout) {
			timer.current = setTimeout(() => {
				removeNotificationRef.current(
					notification.id,
					notification.notificationType
				);
				timer.current = null;
			}, notification.timeout);
		}

		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, [notification]);

	return (
		<div
			className={`notification notification--${notification.notificationType}`}
		>
			<div className="notification__description">{notification.text}</div>
		</div>
	);
};
