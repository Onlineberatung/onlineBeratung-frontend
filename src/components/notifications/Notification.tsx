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
	NOTIFICATION_TYPE_NONE,
	NotificationDefaultType,
	NotificationsContext,
	NotificationType
} from '../../globalState';
import { ReactComponent as ExclamationIcon } from '../../resources/img/icons/exclamation-mark.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import { ReactComponent as ErrorIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as CheckIcon } from '../../resources/img/icons/checkmark-white.svg';
import { ReactComponent as CloseIcon } from '../../resources/img/icons/x.svg';
import { useTranslation } from 'react-i18next';

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
		case NOTIFICATION_TYPE_NONE:
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

	const { t: translate } = useTranslation();

	const removeNotificationRef = useRef(removeNotification);
	const timer = useRef(null);

	useEffect(() => {
		removeNotificationRef.current = removeNotification;
	}, [removeNotification]);

	const closeNotification = useCallback(() => {
		if (notification.onClose) {
			notification.onClose(notification);
		}
		removeNotificationRef.current(
			notification.id,
			notification.notificationType
		);
	}, [notification]);

	useEffect(() => {
		if (!timer.current && notification.timeout) {
			timer.current = setTimeout(() => {
				closeNotification();
			}, notification.timeout);
		}

		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
				timer.current = null;
			}
		};
	}, [closeNotification, notification]);

	const getIcon = () => {
		switch (notification.notificationType) {
			case NOTIFICATION_TYPE_SUCCESS:
				return (
					<CheckIcon
						title={translate('notification.success')}
						aria-label={translate('notification.success')}
					/>
				);
			case NOTIFICATION_TYPE_WARNING:
				return (
					<ExclamationIcon
						title={translate('notification.warning')}
						aria-label={translate('notification.warning')}
					/>
				);
			case NOTIFICATION_TYPE_ERROR:
				return (
					<ErrorIcon
						title={translate('notification.error')}
						aria-label={translate('notification.error')}
					/>
				);
			case NOTIFICATION_TYPE_NONE:
				return null;
			case NOTIFICATION_TYPE_INFO:
			default:
				return (
					<InfoIcon
						title={translate('notification.info')}
						aria-label={translate('notification.info')}
					/>
				);
		}
	};

	const icon = getIcon();

	return (
		<div
			className={`notification notification--${notification.notificationType}`}
		>
			<div className="notification__header">
				{icon && <div className="notification__icon">{icon}</div>}

				{typeof notification.title === 'string' ? (
					<div
						className="notification__title"
						dangerouslySetInnerHTML={{
							__html: notification.title
						}}
					></div>
				) : (
					<div className="notification__title">
						{notification.title}
					</div>
				)}
				{notification.closeable && (
					<div
						className="notification__close"
						onClick={closeNotification}
					>
						<CloseIcon />
					</div>
				)}
			</div>
			{typeof notification.text === 'string' ? (
				<div
					className="notification__text"
					dangerouslySetInnerHTML={{
						__html: notification.text
					}}
				></div>
			) : (
				<div className="notification__text">{notification.text}</div>
			)}
		</div>
	);
};
