import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { VideoCallMessageDTO } from './MessageItemComponent';
import { currentUserWasVideoCallInitiator } from '../../resources/scripts/helpers/videoCallHelpers';

interface VideoCallMessageProps {
	videoCallMessage: VideoCallMessageDTO;
	activeSessionUsername: string;
}

export const VideoCallMessage = (props: VideoCallMessageProps) => {
	return (
		<div className="videoCallMessage__subjectWrapper">
			<p className="videoCallMessage__subject">
				{currentUserWasVideoCallInitiator(
					props.videoCallMessage.rcUserId
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
						{translate('videoCall.incomingCall.ignored')}
					</>
				)}
			</p>
			<CallOffIcon className="videoCallMessage__icon" />
		</div>
	);
};
