import * as React from 'react';
import {
	IncomingVideoCall,
	IncomingVideoCallProps
} from '../incomingVideoCall/IncomingVideoCall';
import './notifications.styles';

interface NotificationsProps {
	notifications: IncomingVideoCallProps[];
}

export const Notifications = (props: NotificationsProps) => {
	return (
		<div className="notifications">
			{props.notifications.map(
				(notification: IncomingVideoCallProps, index) => {
					return (
						notification.url && (
							<IncomingVideoCall {...notification} key={index} />
						)
					);
				}
			)}
		</div>
	);
};
