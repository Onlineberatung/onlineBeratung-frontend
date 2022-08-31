import { isUserModerator } from '../session/sessionHelpers';
import * as React from 'react';
import { useCallback, useContext } from 'react';
import { getPrettyDateFromMessageDate } from '../../utils/dateHelpers';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ForwardMessageDTO } from './MessageItemComponent';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { FlyoutMenu } from '../flyoutMenu/FlyoutMenu';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { BanUser } from '../banUser/BanUser';
import { useTranslation } from 'react-i18next';

interface MessageDisplayNameProps {
	alias?: ForwardMessageDTO;
	isUser: Boolean;
	isMyMessage: Boolean;
	type: 'forwarded' | 'user' | 'consultant' | 'self' | 'system';
	userId: string;
	username: string;
	isUserBanned?: boolean;
	displayName: string;
}

export const MessageDisplayName = ({
	alias,
	isUser,
	isMyMessage,
	type,
	userId,
	username,
	isUserBanned,
	displayName
}: MessageDisplayNameProps) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);

	const forwardedLabel = useCallback(() => {
		const prettyDate = getPrettyDateFromMessageDate(
			Math.round(alias.timestamp / 1000)
		);
		const translatedDate = prettyDate.str
			? translate(prettyDate.str)
			: translate(prettyDate.date);

		return translate('message.forward.label', {
			username: alias?.username,
			translatedDate,
			time: alias?.timestamp
		});
	}, [alias?.timestamp, alias?.username, translate]);

	const subscriberIsModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: userId
	});
	const currentUserIsModerator = isUserModerator({
		chatItem: activeSession.item,
		rcUserId: getValueFromCookie('rc_uid')
	});

	const getUsernameWithPrefix = useCallback(() => {
		if (isMyMessage) {
			return translate('message.isMyMessage.name');
		} else if (
			(!isMyMessage && isUser) ||
			(!subscriberIsModerator && isUser)
		) {
			return displayName;
		} else {
			return subscriberIsModerator
				? translate('session.groupChat.consultant.prefix') + displayName
				: translate('session.consultant.prefix') + displayName;
		}
	}, [displayName, isMyMessage, isUser, subscriberIsModerator, translate]);

	return (
		<>
			{!alias && displayName && (
				<div
					className={`messageItem__username messageItem__username--${type}`}
				>
					{getUsernameWithPrefix()}
					{currentUserIsModerator && !subscriberIsModerator && (
						<FlyoutMenu position="right" isHidden={isUserBanned}>
							<BanUser
								userName={username}
								rcUserId={userId}
								chatId={activeSession.item.id}
							/>
						</FlyoutMenu>
					)}
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
