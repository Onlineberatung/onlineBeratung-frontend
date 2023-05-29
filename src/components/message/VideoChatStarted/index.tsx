import React from 'react';
import { ReactComponent as VideoCallIcon } from '../../../resources/img/illustrations/video-call.svg';
import { Text } from '../../text/Text';
import { BUTTON_TYPES, Button } from '../../button/Button';
import { decodeUsername } from '../../../utils/encryptionHelpers';
import { useAdviceSeekerJoinVideoCall } from '../../sessionHeader/GroupChatHeader/useAdviceSeekerJoinVideoCall';
import { ReactComponent as VideoCalIcon } from '../../../resources/img/icons/video-booking.svg';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface VideoChatStartedProps {
	data: VideoChatStartedAlias;
}

export interface VideoChatStartedAlias {
	date: string;
	durationSeconds: number;
	moderator_user: string;
	note: string;
	title: string;
	type: string;
}

export const VideoChatStarted = ({ data }: VideoChatStartedProps) => {
	const { t } = useTranslation();
	const { joinVideoCall } = useAdviceSeekerJoinVideoCall();

	return (
		<>
			<div className={styles.messageTitle}>
				<VideoCalIcon className={styles.videoCallIcon} />
				<Text
					text={t('message.video.moderatorStartedTitle', {
						name: decodeUsername(data.moderator_user)
					})}
					type="standard"
				/>
			</div>
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
				<VideoCallIcon />
			</div>
		</>
	);
};
