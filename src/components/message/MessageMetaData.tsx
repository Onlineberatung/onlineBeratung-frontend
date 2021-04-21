import * as React from 'react';
import { useContext } from 'react';
import {
	UserDataContext,
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { formatToHHMM } from '../../resources/scripts/helpers/dateHelpers';
import {
	SESSION_TYPES,
	isGroupChatForSessionItem
} from '../session/sessionHelpers';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';

interface MessageMetaDataProps {
	isMyMessage: Boolean;
	isNotRead: Boolean;
	isVideoCallMessage: Boolean;
	messageTime: string;
	type: string;
}

export const MessageMetaData = (props: MessageMetaDataProps) => {
	const { userData } = useContext(UserDataContext);
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const isGroupChat = isGroupChatForSessionItem(activeSession);

	const isReadStatus = () => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			activeSession.isFeedbackSession ||
			props.isVideoCallMessage
		) {
			return null;
		}

		if (isGroupChat || props.type === 'user') {
			return null;
		}

		return (
			<div
				className={
					props.isNotRead
						? `messageItem__readStatus messageItem__readStatus--grey`
						: `messageItem__readStatus`
				}
			>
				<CheckmarkIcon />
			</div>
		);
	};

	const getMessageTime = () => {
		return props.messageTime ? (
			<div
				className={
					props.isMyMessage &&
					activeSession.type !== SESSION_TYPES.ENQUIRY
						? `messageItem__time messageItem__time--right`
						: `messageItem__time`
				}
			>
				{formatToHHMM(props.messageTime)}
			</div>
		) : (
			''
		);
	};

	return (
		<div className="messageItem__metaData">
			{getMessageTime()}
			{isReadStatus()}
		</div>
	);
};
