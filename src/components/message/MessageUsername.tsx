import { getChatItemForSession, isGroupChat } from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import * as React from 'react';
import { useContext } from 'react';
import {
	getPrettyDateFromMessageDate,
	formatToHHMM
} from '../../utils/dateHelpers';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ForwardMessageDTO } from './MessageItemComponent';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';

interface MessageUsernameProps {
	alias?: ForwardMessageDTO;
	isUser: Boolean;
	isMyMessage: Boolean;
	type: 'forwarded' | 'user' | 'consultant' | 'self' | 'system';
	userId: string;
	username: string;
}

export const MessageUsername = (props: MessageUsernameProps) => {
	const activeSession = useContext(ActiveSessionContext);
	const chatItem = getChatItemForSession(activeSession);

	const forwardedLabel = () => {
		const date = getPrettyDateFromMessageDate(
			Math.round(props.alias.timestamp / 1000)
		);
		return translate('message.forwardedLabel')(
			props.alias.username,
			date,
			formatToHHMM(props.alias.timestamp)
		);
	};

	const userIsModerator = () =>
		isGroupChat(chatItem) &&
		chatItem.moderators &&
		chatItem.moderators.includes(props.userId);
	const getUsernameWithPrefix = () => {
		if (props.isMyMessage) {
			return translate('message.isMyMessage.name');
		} else if (
			(!props.isMyMessage && props.isUser) ||
			(!userIsModerator() && props.isUser)
		) {
			return props.username;
		} else {
			return userIsModerator()
				? translate('session.groupChat.consultant.prefix') +
						props.username
				: translate('session.consultant.prefix') + props.username;
		}
	};

	return (
		<>
			{!props.alias && props.username && (
				<div
					className={`messageItem__username messageItem__username--${props.type}`}
				>
					{getUsernameWithPrefix()}
				</div>
			)}

			{props.alias ? (
				<div className="messageItem__username messageItem__username--forwarded">
					<ArrowForwardIcon />
					{forwardedLabel()}
				</div>
			) : (
				''
			)}
		</>
	);
};
