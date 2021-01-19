import * as React from 'react';
import { IncomingCall, IncomingCallProps } from '../incomingCall/IncomingCall';
import './notifications.styles';
import incomingCallRingtone from '../../resources/audio/incomingCall.mp3';

interface NotificationsProps {
	notifications: IncomingCallProps[];
}

export const Notifications = (props: NotificationsProps) => {
	const hasIncomingVideoCall: boolean = props.notifications.some(
		(notification) => notification['notificationType'] === 'call'
	);

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
			{hasIncomingVideoCall && (
				<audio loop autoPlay>
					<source src={incomingCallRingtone}></source>
				</audio>
			)}
		</div>
	);
};
