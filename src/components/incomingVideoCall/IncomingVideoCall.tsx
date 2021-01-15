import * as React from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import './incomingVideoCall.styles';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';
import { translate } from '../../resources/scripts/i18n/translate';
import { useContext } from 'react';
import { NotificationsContext } from '../../globalState';
import { getVideoCallUrl } from '../../resources/scripts/helpers/videoCallHelpers';

export interface IncomingVideoCallProps {
	username: string;
	url: string;
	rcGroupId: string;
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

const buttonRejectVideoCall: ButtonItem = {
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

export const IncomingVideoCall = (props: IncomingVideoCallProps) => {
	const { notifications, setNotifications } = useContext(
		NotificationsContext
	);

	const handleJoinVideoCall = (isVideoActivated: boolean = false) => {
		window.open(getVideoCallUrl(props.url, isVideoActivated));
		removeIncomingVideoCallNotification();
	};

	const handleRejectVideoCall = () => {
		console.log('reject call');
		//TODO: reject call BE -> groupId

		removeIncomingVideoCallNotification();
	};

	const removeIncomingVideoCallNotification = () => {
		const currentNotifications = notifications.filter((notification) => {
			return notification.rcGroupId !== props.rcGroupId;
		});
		setNotifications(currentNotifications);
	};

	return (
		<div className="incomingVideoCall">
			<p className="incomingVideoCall__description">
				<span className="incomingVideoCall__username">
					{props.username}
				</span>{' '}
				{translate('videoCall.incomingCall.description')}
			</p>
			<div className="incomingVideoCall__user">
				{getInitials(props.username)}
			</div>
			<div className="incomingVideoCall__buttons">
				<Button
					buttonHandle={() => handleJoinVideoCall(true)}
					item={buttonStartVideoCall}
				/>
				<Button
					buttonHandle={() => handleJoinVideoCall()}
					item={buttonStartCall}
				/>
				<Button
					buttonHandle={() => handleRejectVideoCall()}
					item={buttonRejectVideoCall}
				/>
			</div>
		</div>
	);
};
