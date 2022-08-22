import * as React from 'react';
import { ICON_CALL_OFF, SystemMessage } from './SystemMessage';
import { VideoCallMessageDTO } from './MessageItemComponent';
import {
	currentUserIsTeamConsultant,
	currentUserWasVideoCallInitiator
} from '../../utils/videoCallHelpers';
import { useTranslation } from 'react-i18next';
interface VideoCallMessageProps {
	videoCallMessage: VideoCallMessageDTO;
	activeSessionUsername: string;
	activeSessionAskerRcId: string;
}

export const VideoCallMessage = (props: VideoCallMessageProps) => {
	const { t: translate } = useTranslation();

	return (
		<SystemMessage
			icon={ICON_CALL_OFF}
			subject={
				currentUserWasVideoCallInitiator(
					props.videoCallMessage.initiatorRcUserId
				) ? (
					<>
						{translate('videoCall.incomingCall.rejected.prefix')}{' '}
						<b>{props.activeSessionUsername}</b>{' '}
						{translate('videoCall.incomingCall.rejected.suffix')}
					</>
				) : (
					<>
						<b>{props.videoCallMessage.initiatorUserName}</b>{' '}
						{currentUserIsTeamConsultant(
							props.videoCallMessage.initiatorRcUserId,
							props.activeSessionAskerRcId
						) ? (
							<>
								{translate(
									'videoCall.incomingCall.rejected.teamconsultant.prefix'
								)}{' '}
								<b>{props.activeSessionUsername}</b>{' '}
								{translate(
									'videoCall.incomingCall.rejected.suffix'
								)}
							</>
						) : (
							translate('videoCall.incomingCall.ignored')
						)}
					</>
				)
			}
		/>
	);
};
