import * as React from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';
import { translate } from '../../utils/translate';
import { useContext } from 'react';
import { NotificationType, NotificationsContext } from '../../globalState';
import { getVideoCallUrl } from '../../utils/videoCallHelpers';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { apiRejectVideoCall } from '../../api';
import './incomingVideoCall.styles';

export interface VideoCallRequestProps {
	rcGroupId: string;
	initiatorRcUserId: string;
	initiatorUsername: string;
	videoCallUrl: string;
}

export const NOTIFICATION_TYPE_CALL = 'call';
export type NotificationTypeCall = typeof NOTIFICATION_TYPE_CALL;

export interface IncomingVideoCallProps extends NotificationType {
	notificationType: NotificationTypeCall;
	videoCall: VideoCallRequestProps;
}

export const isNotificationTypeCall = (
	notification: NotificationType
): notification is IncomingVideoCallProps => {
	return notification.notificationType === NOTIFICATION_TYPE_CALL;
};

const buttonAnswerCall: ButtonItem = {
	icon: <CallOnIcon />,
	smallIconBackgroundColor: 'green',
	title: translate('videoCall.button.answerCall'),
	type: BUTTON_TYPES.SMALL_ICON
};

const buttonAnswerVideoCall: ButtonItem = {
	icon: <CameraOnIcon />,
	smallIconBackgroundColor: 'green',
	title: translate('videoCall.button.answerVideoCall'),
	type: BUTTON_TYPES.SMALL_ICON
};

const buttonRejectVideoCall: ButtonItem = {
	type: BUTTON_TYPES.SMALL_ICON,
	smallIconBackgroundColor: 'red',
	title: translate('videoCall.button.rejectCall'),
	icon: <CallOffIcon />
};

const getInitials = (text: string) => {
	const maxInitials = 3;
	const initials = [];
	const splitted = text.split(' ');
	splitted.forEach((word) => {
		initials.push(word.charAt(0).toUpperCase());
	});

	return initials.slice(0, maxInitials).join('');
};

export const IncomingVideoCall = (props: IncomingVideoCallProps) => {
	const { removeNotification } = useContext(NotificationsContext);

	const decodedUsername = decodeUsername(props.videoCall.initiatorUsername);

	const handleAnswerVideoCall = (isVideoActivated: boolean = false) => {
		window.open(
			getVideoCallUrl(props.videoCall.videoCallUrl, isVideoActivated)
		);
		removeIncomingVideoCallNotification();
	};

	const handleRejectVideoCall = () => {
		apiRejectVideoCall(
			decodedUsername,
			props.videoCall.rcGroupId,
			props.videoCall.initiatorRcUserId
		)
			.then(() => {
				removeIncomingVideoCallNotification();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const removeIncomingVideoCallNotification = () => {
		removeNotification(props.videoCall.rcGroupId, NOTIFICATION_TYPE_CALL);
	};

	return (
		<div
			className="notification incomingVideoCall"
			data-cy="incoming-video-call"
		>
			<p className="incomingVideoCall__description">
				<span className="incomingVideoCall__username">
					{decodedUsername}
				</span>{' '}
				{translate('videoCall.incomingCall.description')}
			</p>
			<div className="incomingVideoCall__user">
				{getInitials(decodedUsername)}
			</div>
			<div className="incomingVideoCall__buttons">
				<Button
					buttonHandle={() => handleAnswerVideoCall(true)}
					item={buttonAnswerVideoCall}
					testingAttribute="answer-incoming-video-call"
				/>
				<Button
					buttonHandle={() => handleAnswerVideoCall()}
					item={buttonAnswerCall}
				/>
				<Button
					buttonHandle={() => handleRejectVideoCall()}
					item={buttonRejectVideoCall}
					testingAttribute="reject-incoming-video-call"
				/>
			</div>
		</div>
	);
};
