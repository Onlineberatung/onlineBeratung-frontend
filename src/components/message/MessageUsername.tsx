import {
	SESSION_TYPES,
	getChatItemForSession
} from '../session/sessionHelpers';
import { translate } from '../../resources/scripts/i18n/translate';
import * as React from 'react';
import { useContext } from 'react';
import {
	getPrettyDateFromMessageDate,
	formatToHHMM
} from '../../resources/scripts/helpers/dateHelpers';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession
} from '../../globalState';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';

interface MessageUsernameProps {
	alias?: any;
	isUser: Boolean;
	isMyMessage: Boolean;
	type: 'forwarded' | 'user' | 'consultant' | 'self' | 'system';
	userId: string;
	username: string;
}

export const MessageUsername = (props: MessageUsernameProps) => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
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
		chatItem.moderators && chatItem.moderators.includes(props.userId);
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
			{!props.alias &&
			props.username &&
			chatItem.type !== SESSION_TYPES.ENQUIRY ? (
				<div
					className={`messageItem__username messageItem__username--${props.type}`}
				>
					{getUsernameWithPrefix()}
				</div>
			) : (
				''
			)}

			{props.alias ? (
				<div className="messageItem__username messageItem__username--forwarded">
					<ArrowForwardIcon
						width="16"
						height="16"
						viewBox="0 0 24 19"
					/>
					{forwardedLabel()}
				</div>
			) : (
				''
			)}
		</>
	);
};
