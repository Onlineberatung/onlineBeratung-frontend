import * as React from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import { currentUserWasVideoCallInitiator } from '../../resources/scripts/helpers/videoCallHelpers';
import { VideoCallMessageDTO } from '../message/MessageItemComponent';

interface SessionListItemVideoCallProps {
	videoCallMessage: VideoCallMessageDTO;
	listItemUsername: string;
}

export const SessionListItemVideoCall = (
	props: SessionListItemVideoCallProps
) => {
	return (
		<div className="sessionsListItem__subject">
			{currentUserWasVideoCallInitiator(
				props.videoCallMessage.rcUserId
			) ? (
				<>
					{translate('videoCall.incomingCall.rejected.prefix')}{' '}
					{props.listItemUsername}{' '}
					{translate('videoCall.incomingCall.rejected.suffix')}
				</>
			) : (
				<>
					{props.videoCallMessage.initiatorUserName}{' '}
					{translate('videoCall.incomingCall.ignored')}
				</>
			)}
			<CallOffIcon className="sessionsListItem__videoCallMessageIcon" />
		</div>
	);
};
