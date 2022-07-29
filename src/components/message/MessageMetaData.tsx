import * as React from 'react';
import { useContext } from 'react';
import {
	UserDataContext,
	hasUserAuthority,
	AUTHORITIES
} from '../../globalState';
import { formatToHHMM } from '../../utils/dateHelpers';
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
	const { activeSession } = useContext(ActiveSessionContext);

	const isReadStatus = () => {
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData) ||
			(!activeSession.isGroup && activeSession.isFeedback) ||
			props.isReadStatusDisabled
		) {
			return null;
		}

		if (activeSession.isGroup || props.type === 'user') {
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
