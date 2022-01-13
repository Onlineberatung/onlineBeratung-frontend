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
		<div className="notifications" data-cy="notifications">
			{props.notifications.map(
				(notification: IncomingVideoCallProps, index) => {
					return (
						notification.notificationType === 'call' && (
							<IncomingVideoCall {...notification} key={index} />
						)
					);
				}
			)}
			{hasIncomingVideoCall && (
				<audio loop autoPlay data-cy="incoming-video-call-audio">
					<source
						src={
							process.env.AUDIO_FILE_INCOMING_CALL ??
							incomingCallRingtone
						}
					></source>
				</audio>
			)}
		</div>
	);
};
