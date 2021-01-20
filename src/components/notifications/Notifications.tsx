import * as React from 'react';
import {
	IncomingVideoCall,
	IncomingVideoCallProps
} from '../incomingVideoCall/IncomingVideoCall';
import './notifications.styles';
import incomingCallRingtone from '../../resources/audio/incomingCall.mp3';

interface NotificationsProps {
	notifications: IncomingVideoCallProps[];
}

export const Notifications = (props: NotificationsProps) => {
	const hasIncomingVideoCall: boolean = props.notifications.some(
		(notification) => notification['notificationType'] === 'call'
	);

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
			{hasIncomingVideoCall && (
				<audio loop autoPlay>
					<source src={incomingCallRingtone}></source>
				</audio>
			)}
		</div>
	);
};
