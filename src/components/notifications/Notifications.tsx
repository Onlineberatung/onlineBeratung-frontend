import * as React from 'react';
import { isNotificationTypeCall } from '../incomingVideoCall/IncomingVideoCall';
import './notifications.styles';
import incomingCallRingtone from '../../resources/audio/incomingCall.mp3';
import { NotificationType } from '../../globalState';
import { Notification } from './Notification';
import { supportsE2EEncryptionVideoCall } from '../../utils/videoCallHelpers';

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
			{hasIncomingVideoCall && supportsE2EEncryptionVideoCall() && (
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
