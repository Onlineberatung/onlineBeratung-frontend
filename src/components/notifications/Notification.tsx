import * as React from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	IncomingVideoCall,
	IncomingVideoCallProps,
	NOTIFICATION_TYPE_CALL
} from '../incomingVideoCall/IncomingVideoCall';

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
import { Alert, AlertTitle, Snackbar } from '@mui/material';

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

const SEVERITY_MAP = {
	[NOTIFICATION_TYPE_SUCCESS]: 'success',
	[NOTIFICATION_TYPE_ERROR]: 'error',
	[NOTIFICATION_TYPE_WARNING]: 'warning',
	[NOTIFICATION_TYPE_INFO]: 'info',
	[NOTIFICATION_TYPE_NONE]: 'info'
} as const;

const NotificationDefault = ({
	notification
}: {
	notification: NotificationDefaultType;
}) => {
	const { removeNotification } = useContext(NotificationsContext);

	const removeNotificationRef = useRef(removeNotification);
	const [open, setOpen] = useState(true);

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

	const handleClose = useCallback(
		(_event: React.SyntheticEvent | Event, reason?: string) => {
			if (reason === 'clickaway') return;
			setOpen(false);
		},
		[]
	);

	const severity = SEVERITY_MAP[notification.notificationType] ?? 'info';

	return (
		<Snackbar
			open={open}
			autoHideDuration={notification.timeout ?? null}
			onClose={handleClose}
			TransitionProps={{ onExited: closeNotification }}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			data-cy="notification"
		>
			<Alert
				severity={severity}
				onClose={notification.closeable ? handleClose : undefined}
				variant="filled"
				sx={{ width: '100%', minWidth: 288, maxWidth: 400 }}
			>
				{notification.title && (
					<AlertTitle>
						{typeof notification.title === 'string' ? (
							<span
								dangerouslySetInnerHTML={{
									__html: notification.title
								}}
							/>
						) : (
							notification.title
						)}
					</AlertTitle>
				)}
				{typeof notification.text === 'string' ? (
					<span
						dangerouslySetInnerHTML={{
							__html: notification.text
						}}
					/>
				) : (
					notification.text
				)}
			</Alert>
		</Snackbar>
	);
};
