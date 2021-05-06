import * as React from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { VideoCallMessageDTO } from './MessageItemComponent';
import {
	currentUserIsTeamConsultant,
	currentUserWasVideoCallInitiator
} from '../../utils/videoCallHelpers';

interface VideoCallMessageProps {
	videoCallMessage: VideoCallMessageDTO;
	activeSessionUsername: string;
	activeSessionAskerRcId: string;
}

export const VideoCallMessage = (props: VideoCallMessageProps) => {
	return (
		<div className="videoCallMessage__subjectWrapper">
			<p className="videoCallMessage__subject">
				{currentUserWasVideoCallInitiator(
					props.videoCallMessage.initiatorRcUserId
				) ? (
					<>
						{translate('videoCall.incomingCall.rejected.prefix')}{' '}
						<span className="videoCallMessage__username">
							{props.activeSessionUsername}
						</span>{' '}
						{translate('videoCall.incomingCall.rejected.suffix')}
					</>
				) : (
					<>
						<span className="videoCallMessage__username">
							{props.videoCallMessage.initiatorUserName}
						</span>{' '}
						{currentUserIsTeamConsultant(
							props.videoCallMessage.initiatorRcUserId,
							props.activeSessionAskerRcId
						) ? (
							<>
								{translate(
									'videoCall.incomingCall.rejected.teamconsultant.prefix'
								)}{' '}
								<span className="videoCallMessage__username">
									{props.activeSessionUsername}
								</span>{' '}
								{translate(
									'videoCall.incomingCall.rejected.suffix'
								)}
							</>
						) : (
							translate('videoCall.incomingCall.ignored')
						)}
					</>
				)}
			</p>
			<CallOffIcon className="videoCallMessage__icon" />
		</div>
	);
};
