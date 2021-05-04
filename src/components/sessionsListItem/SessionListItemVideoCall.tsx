import * as React from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as CallOffIcon } from '../../resources/img/icons/call-off.svg';
import {
	currentUserIsTeamConsultant,
	currentUserWasVideoCallInitiator
} from '../../utils/videoCallHelpers';
import { VideoCallMessageDTO } from '../message/MessageItemComponent';

interface SessionListItemVideoCallProps {
	videoCallMessage: VideoCallMessageDTO;
	listItemUsername: string;
	listItemAskerRcId: string;
}

export const SessionListItemVideoCall = (
	props: SessionListItemVideoCallProps
) => {
	return (
		<div className="sessionsListItem__subject">
			{currentUserWasVideoCallInitiator(
				props.videoCallMessage.initiatorRcUserId
			) ? (
				<>
					{translate('videoCall.incomingCall.rejected.prefix')}{' '}
					{props.listItemUsername}{' '}
					{translate('videoCall.incomingCall.rejected.suffix')}
				</>
			) : (
				<>
					{props.videoCallMessage.initiatorUserName}{' '}
					{currentUserIsTeamConsultant(
						props.videoCallMessage.initiatorRcUserId,
						props.listItemAskerRcId
					) ? (
						<>
							{translate(
								'videoCall.incomingCall.rejected.teamconsultant.prefix'
							)}{' '}
							{props.listItemUsername}{' '}
							{translate(
								'videoCall.incomingCall.rejected.suffix'
							)}
						</>
					) : (
						translate('videoCall.incomingCall.ignored')
					)}
				</>
			)}
			<CallOffIcon className="sessionsListItem__videoCallMessageIcon" />
		</div>
	);
};
