import * as React from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import './incomingCall.styles';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';
import { translate } from '../../resources/scripts/i18n/translate';
import { useContext } from 'react';
import { NotificationsContext } from '../../globalState';
import {
	CallType,
	getCallUrl,
	NotificationType
} from '../../resources/scripts/helpers/callHelpers';

export interface IncomingCallProps {
	notificationType: NotificationType;
	rcGroupId: string;
	username: string;
	url: string;
}

const buttonStartCall: ButtonItem = {
	type: BUTTON_TYPES.SMALL_ICON,
	smallIconBackgroundColor: 'green',
	icon: <CallOnIcon />
};

const buttonStartVideoCall: ButtonItem = {
	type: BUTTON_TYPES.SMALL_ICON,
	smallIconBackgroundColor: 'green',
	icon: <CameraOnIcon />
};

const buttonRejectCall: ButtonItem = {
	type: BUTTON_TYPES.SMALL_ICON,
	smallIconBackgroundColor: 'red',
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

export const IncomingCall = (props: IncomingCallProps) => {
	const { notifications, setNotifications } = useContext(
		NotificationsContext
	);

	const handleStartCall = (callType: CallType) => {
		window.open(getCallUrl(callType, props.url));
		removeIncomingCallNotification();
	};

	const handleRejectCall = () => {
		console.log('reject call');
		//TODO: reject call BE -> groupId

		removeIncomingCallNotification();
	};

	const removeIncomingCallNotification = () => {
		const currentNotifications = notifications.filter((notification) => {
			return notification.rcGroupId !== props.rcGroupId;
		});
		setNotifications(currentNotifications);
	};

	return (
		<div className="incomingCall">
			<p className="incomingCall__description">
				<span className="incomingCall__username">{props.username}</span>{' '}
				{translate('call.incomingCall.description')}
			</p>
			<div className="incomingCall__user">
				{getInitials(props.username)}
			</div>
			<div className="incomingCall__buttons">
				<Button
					buttonHandle={() => handleStartCall('video')}
					item={buttonStartVideoCall}
				/>
				<Button
					buttonHandle={() => handleStartCall('audio')}
					item={buttonStartCall}
				/>
				<Button
					buttonHandle={() => handleRejectCall()}
					item={buttonRejectCall}
				/>
			</div>
		</div>
	);
};
