import * as React from 'react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import {
	IncomingVideoCall,
	IncomingVideoCallProps,
	NOTIFICATION_TYPE_CALL
} from '../incomingVideoCall/IncomingVideoCall';
import './notification.styles';

import {
	NOTIFICATION_TYPE_ERROR,
	NOTIFICATION_TYPE_INFO,
	NOTIFICATION_TYPE_SUCCESS,
	NOTIFICATION_TYPE_WARNING,
	NotificationDefaultType,
	NotificationsContext,
	NotificationType
} from '../../globalState';
import { ReactComponent as ExclamationIcon } from '../../resources/img/icons/exclamation-mark.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as ErrorIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as CheckIcon } from '../../resources/img/icons/checkmark-white.svg';

type NotificationProps = {
	notification: NotificationType;
};

export const Notification = ({ notification }: NotificationProps) => {
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
		case NOTIFICATION_TYPE_ERROR:
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

	const getIcon = useCallback(() => {
		switch (notification.notificationType) {
			case NOTIFICATION_TYPE_SUCCESS:
				return <CheckIcon />;
			case NOTIFICATION_TYPE_WARNING:
				return <ExclamationIcon />;
			case NOTIFICATION_TYPE_ERROR:
				return <ErrorIcon />;
			case NOTIFICATION_TYPE_INFO:
			default:
				return <InfoIcon />;
		}
	}, [notification]);

	return (
		<div
			className={`notification notification--${notification.notificationType}`}
		>
			<div className="notification__header">
				<div className="notification__icon">{getIcon()}</div>
				<div className="notification__title">{notification.title}</div>
			</div>
			<div className="notification__text">{notification.text}</div>
		</div>
	);
};
