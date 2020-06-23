import {
	SESSION_TYPES,
	getChatItemForSession
} from '../../session/ts/sessionHelpers';
import { translate } from '../../../resources/ts/i18n/translate';
import * as React from 'react';
import { useContext } from 'react';
import {
	getSessionsListItemDate,
	getSessionListTime
} from '../../sessionsListItem/ts/sessionsListItemHelpers';
import {
	SessionsDataContext,
	ActiveSessionGroupIdContext,
	getActiveSession
} from '../../../globalState';

interface MessageUsernameProps {
	alias?: any;
	isUser: Boolean;
	isMyMessage: Boolean;
	type: string; // forwarded, user, consultant
	userId: string;
	username: string;
}

export const MessageUsername = (props: MessageUsernameProps) => {
	const { sessionsData } = useContext(SessionsDataContext);
	const { activeSessionGroupId } = useContext(ActiveSessionGroupIdContext);
	const activeSession = getActiveSession(activeSessionGroupId, sessionsData);
	const chatItem = getChatItemForSession(activeSession);

	const forwardedLabel = () => {
		const date = getSessionsListItemDate(
			Math.round(props.alias.timestamp / 1000)
		);
		return translate('message.forwardedLabel')(
			props.alias.username,
			date,
			getSessionListTime(props.alias.timestamp)
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
					<svg
						viewBox="0 0 24 19"
						width="24"
						height="19"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15.723 14.07C9.099 13.403 2.815 15.552.24 20.667c.787-6.973 6.376-12.64 15.579-13.307l-1.964-1.964a.61.61 0 0 1-.188-.447.61.61 0 0 1 .188-.446l1.638-1.648a.616.616 0 0 1 .451-.188c.176 0 .327.062.452.188l7.355 7.365a.61.61 0 0 1 .188.447.61.61 0 0 1-.188.447l-7.355 7.364a.616.616 0 0 1-.452.189.616.616 0 0 1-.451-.189l-1.638-1.647a.61.61 0 0 1-.188-.447.61.61 0 0 1 .188-.447l1.868-1.867z"
							id="a"
						/>
					</svg>
					{forwardedLabel()}
				</div>
			) : (
				''
			)}
		</>
	);
};
