import * as React from 'react';
import { IncomingCall, IncomingCallProps } from '../incomingCall/IncomingCall';
import './notifications.styles';

interface NotificationsProps {
	notifications: IncomingCallProps[];
}

export const Notifications = (props: NotificationsProps) => {
	return (
		<div className="notifications">
			{props.notifications.map(
				(notification: IncomingCallProps, index) => {
					return (
						notification.url && (
							<IncomingCall {...notification} key={index} />
						)
					);
				}
			)}
		</div>
	);
};
