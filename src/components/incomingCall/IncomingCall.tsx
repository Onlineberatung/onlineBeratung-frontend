import * as React from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import './incomingCall.styles';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';

export interface IncomingCallProps {
	username: string;
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
	return (
		<div className="incomingCall">
			<p className="incomingCall__description">
				{props.username} ruft Sie an...
			</p>
			<div className="incomingCall__user">
				{getInitials(props.username)}
			</div>
			<div className="incomingCall__buttons">
				<Button
					buttonHandle={(e) => console.log(e)}
					item={buttonStartCall}
				/>
				<Button
					buttonHandle={(e) => console.log(e)}
					item={buttonStartVideoCall}
				/>
				<Button
					buttonHandle={(e) => console.log(e)}
					item={buttonRejectCall}
				/>
			</div>
		</div>
	);
};
