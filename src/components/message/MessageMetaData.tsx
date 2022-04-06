import * as React from 'react';
import { useContext } from 'react';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { formatToHHMM } from '../../utils/dateHelpers';
import { isGroupChatForSessionItem } from '../session/sessionHelpers';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

interface MessageMetaDataProps {
	isMyMessage: Boolean;
	isNotRead: Boolean;
	isReadStatusDisabled: Boolean;
	messageTime: string;
	type: string;
}

export const MessageMetaData = (props: MessageMetaDataProps) => {
	const { userData } = useContext(UserDataContext);
	const activeSession = useContext(ActiveSessionContext);
	const isGroupChat = isGroupChatForSessionItem(activeSession);

	const isReadStatus = () => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData) ||
			activeSession?.isFeedbackSession ||
			props.isReadStatusDisabled
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
			<div className="messageItem__time">
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
