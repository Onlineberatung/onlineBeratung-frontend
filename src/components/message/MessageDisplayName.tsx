import { isUserModerator } from '../session/sessionHelpers';
import * as React from 'react';
import { useCallback, useContext } from 'react';
import {
	formatToHHMM,
	getPrettyDateFromMessageDate
} from '../../utils/dateHelpers';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ForwardMessageDTO } from './MessageItemComponent';
import { ActiveSessionContext } from '../../globalState';
import { useTranslation } from 'react-i18next';

interface MessageDisplayNameProps {
	alias?: ForwardMessageDTO;
	isUser: Boolean;
	isMyMessage: Boolean;
	type: 'forwarded' | 'user' | 'consultant' | 'self' | 'system';
	userId: string;
	username: string;
	displayName: string;
}

export const MessageDisplayName = ({
	alias,
	isUser,
	isMyMessage,
	type,
	userId,
	username,
	displayName
}: MessageDisplayNameProps) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);

	const forwardedLabel = useCallback(() => {
		const prettyDate = getPrettyDateFromMessageDate(
			Math.round(alias.timestamp / 1000)
		);

		return translate('message.forward.label', {
			username: alias.displayName || alias.username,
			date: prettyDate.str
				? translate(prettyDate.str)
				: translate(prettyDate.date),
			time: alias.timestamp && formatToHHMM(alias.timestamp)
		});
	}, [alias, translate]);

	const subscriberIsModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: userId
	});

	const getUsernameWithPrefix = useCallback(() => {
		if (isMyMessage) {
			return translate('message.isMyMessage.name');
		} else if (
			(!isMyMessage && isUser) ||
			(!subscriberIsModerator && isUser)
		) {
			return displayName || username;
		} else {
			return subscriberIsModerator
				? translate('session.groupChat.consultant.prefix') +
						(displayName || username)
				: translate('session.consultant.prefix') +
						(displayName || username);
		}
	}, [
		displayName,
		isMyMessage,
		isUser,
		subscriberIsModerator,
		translate,
		username
	]);

	return (
		<>
			{!alias && displayName && (
				<div
					className={`messageItem__username messageItem__username--${type}`}
				>
					{getUsernameWithPrefix()}
				</div>
			)}

			{alias && (
				<div className="messageItem__username messageItem__username--forwarded">
					<ArrowForwardIcon />
					{forwardedLabel()}
				</div>
			)}
		</>
	);
};
