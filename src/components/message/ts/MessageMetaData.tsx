import * as React from 'react';
import { useContext } from 'react';
import {
	UserDataContext,
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession,
	hasUserAuthority,
	AUTHORITIES
} from '../../../globalState';
import { formatToHHMM } from '../../../resources/ts/helpers/dateHelpers';
import {
	SESSION_TYPES,
	isGroupChatForSessionItem
} from '../../session/ts/sessionHelpers';

interface MessageMetaDataProps {
	isMyMessage: Boolean;
	isNotRead: Boolean;
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
			hasUserAuthority(AUTHORITIES.USER_DEFAULT, userData) ||
			activeSession.isFeedbackSession
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
				<svg
					width="72"
					height="72"
					viewBox="0 0 72 72"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.2527 33.2086C8.79968 31.1399 11.7308 30.717 13.7995 32.264C13.9759 32.3959 14.1428 32.5402 14.2989 32.6956L29.2722 47.6078L57.19 8.91835C58.6842 6.84771 61.574 6.38037 63.6447 7.87452C63.801 7.98733 63.9501 8.10981 64.0912 8.24124C66.2872 10.2875 66.6321 13.6422 64.8984 16.0926L31.9439 62.669C31.3059 63.5707 30.0578 63.7844 29.1561 63.1465C29.0579 63.077 28.9662 62.9989 28.8821 62.913L7.79548 41.3755C5.62571 39.1594 5.3953 35.6924 7.2527 33.2086Z"
						fill="black"
					/>
				</svg>
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
