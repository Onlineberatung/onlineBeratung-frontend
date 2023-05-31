import React from 'react';
import { ReactComponent as VideoIllustration } from '../../../resources/img/illustrations/video-call.svg';
import { Text } from '../../text/Text';
import { BUTTON_TYPES, Button } from '../../button/Button';
import { decodeUsername } from '../../../utils/encryptionHelpers';
import { useAdviceSeekerJoinVideoCall } from '../../sessionHeader/GroupChatHeader/useAdviceSeekerJoinVideoCall';
import { ReactComponent as VideoCallIcon } from '../../../resources/img/illustrations/camera.svg';
import { ReactComponent as CameraOffIcon } from '../../../resources/img/illustrations/camera_off.svg';
import { useTranslation } from 'react-i18next';
import { getDurationTimeBySeconds } from '../../../utils/dateHelpers';
import styles from './styles.module.scss';

interface VideoChatDetailsProps {
	isVideoActive: boolean;
	data: VideoChatDetailsAlias;
}

export interface VideoChatDetailsAlias {
	date: string;
	durationSeconds: number;
	moderator_user: string;
	note: string;
	title: string;
	type: string;
	eventType: 'CALL_ENDED' | 'CALL_STARTED';
}

export const VideoChatDetails = ({
	data,
	isVideoActive
}: VideoChatDetailsProps) => {
	const { t } = useTranslation();
	const { joinVideoCall } = useAdviceSeekerJoinVideoCall();

	const isCallEnded = data.eventType === 'CALL_ENDED';
	const Icon = isCallEnded ? CameraOffIcon : VideoCallIcon;
	const textKey = isCallEnded
		? 'message.video.moderatorEndedTitle'
		: 'message.video.moderatorStartedTitle';

	return (
		<>
			<div className={styles.messageTitle}>
				<Icon className={styles.videoCallIcon} />
				<Text
					text={t(textKey, {
						name: decodeUsername(data.moderator_user),
						time: getDurationTimeBySeconds(data.durationSeconds)
					})}
					type="standard"
				/>
			</div>
			{isVideoActive && !isCallEnded && (
				<>
					<div className={styles.container}>
						<div className="infoContainer">
							<div className={styles.titleContainer}>
								<div className={styles.active} />
								<div className="title">
									{t('message.video.callActive')}
								</div>
							</div>
							<div className="titleContainer">
								<Text
									text={t('message.video.description')}
									type={'infoMedium'}
								/>
							</div>

							<Button
								className={styles.button}
								item={{
									label: t('message.video.join'),
									type: BUTTON_TYPES.PRIMARY
								}}
								buttonHandle={() => joinVideoCall(data.note)}
							/>
						</div>
						<VideoIllustration className={styles.illustration} />
					</div>
				</>
			)}
		</>
	);
};
