import * as React from 'react';
import { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import { generatePath, useHistory } from 'react-router-dom';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { ReactComponent as CallOnIcon } from '../../resources/img/icons/call-on.svg';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { ReactComponent as CameraOnIcon } from '../../resources/img/icons/camera-on.svg';
import {
	NotificationType,
	NotificationsContext,
	UserDataContext
} from '../../globalState';
import { supportsE2EEncryptionVideoCall } from '../../utils/videoCallHelpers';
import { decodeUsername } from '../../utils/encryptionHelpers';
import { apiRejectVideoCall } from '../../api';
import './incomingVideoCall.styles';
import { ReactComponent as CloseIcon } from '../../resources/img/icons/x.svg';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

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
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const history = useHistory();

	const { removeNotification } = useContext(NotificationsContext);
	const { userData } = useContext(UserDataContext);

	const decodedUsername = decodeUsername(props.videoCall.initiatorUsername);

	const buttonAnswerCall: ButtonItem = {
		icon: (
			<CallOnIcon
				aria-label={translate('videoCall.button.answerCall')}
				title={translate('videoCall.button.answerCall')}
			/>
		),
		smallIconBackgroundColor: 'green',
		title: translate('videoCall.button.answerCall'),
		type: BUTTON_TYPES.SMALL_ICON
	};

	const buttonAnswerVideoCall: ButtonItem = {
		icon: (
			<CameraOnIcon
				aria-label={translate('videoCall.button.answerVideoCall')}
				title={translate('videoCall.button.answerVideoCall')}
			/>
		),
		smallIconBackgroundColor: 'green',
		title: translate('videoCall.button.answerVideoCall'),
		type: BUTTON_TYPES.SMALL_ICON
	};

	const buttonRejectVideoCall: ButtonItem = {
		type: BUTTON_TYPES.SMALL_ICON,
		smallIconBackgroundColor: 'red',
		title: translate('videoCall.button.rejectCall'),
		icon: (
			<CallOffIcon
				aria-label={translate('videoCall.button.rejectCall')}
				title={translate('videoCall.button.rejectCall')}
			/>
		)
	};

	const handleAnswerVideoCall = (isVideoActivated: boolean = false) => {
		const url = new URL(props.videoCall.videoCallUrl);
		window.open(
			generatePath(settings.urls.videoCall, {
				domain: url.host,
				jwt: url.searchParams.get('jwt'),
				e2e: 0,
				video: isVideoActivated ? 1 : 0,
				username: userData.displayName
					? userData.displayName
					: userData.userName
			})
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
			className={`notification incomingVideoCall`}
			data-cy="incoming-video-call"
		>
			<div className="notification__header">
				<div className="notification__title">
					<div className="incomingVideoCall__user">
						{getInitials(decodedUsername)}
					</div>
				</div>
				{!supportsE2EEncryptionVideoCall() && !isMobile && (
					<div
						className="notification__close"
						onClick={handleRejectVideoCall}
					>
						<CloseIcon />
					</div>
				)}
			</div>

			<p className="incomingVideoCall__description">
				{supportsE2EEncryptionVideoCall() ? (
					<>
						<span className="incomingVideoCall__username">
							{decodedUsername}
						</span>{' '}
						{translate('videoCall.incomingCall.description')}
					</>
				) : (
					<span className="incomingVideoCall__username">
						{translate(
							'videoCall.incomingCall.unsupported.description',
							{
								username: decodedUsername
							}
						)}
					</span>
				)}
			</p>

			{!supportsE2EEncryptionVideoCall() ? (
				<div className="incomingVideoCall__hint">
					{translate(`videoCall.incomingCall.unsupported.hint`)}
					<div className="mt--2">
						<button
							onClick={() => {
								handleRejectVideoCall();
								history.push('/profile/hilfe/videoCall');
							}}
							className="px--2 text--bold"
							type="button"
						>
							{translate(
								`videoCall.incomingCall.unsupported.button`
							)}
						</button>
					</div>
				</div>
			) : (
				<div className="incomingVideoCall__buttons mt--2 py--3">
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
			)}
		</div>
	);
};
