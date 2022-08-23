import { isUserModerator } from '../session/sessionHelpers';
import { translate } from '../../utils/translate';
import * as React from 'react';
import { useCallback, useContext } from 'react';
import {
	getPrettyDateFromMessageDate,
	formatToHHMM
} from '../../utils/dateHelpers';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ForwardMessageDTO } from './MessageItemComponent';
import { ActiveSessionContext } from '../../globalState/provider/ActiveSessionProvider';
import { FlyoutMenu } from '../flyoutMenu/FlyoutMenu';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { BanUser } from '../banUser/BanUser';

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
	const { activeSession } = useContext(ActiveSessionContext);

	const forwardedLabel = useCallback(() => {
		const date = getPrettyDateFromMessageDate(
			Math.round(alias.timestamp / 1000)
		);
		return translate('message.forwardedLabel')(
			alias.username, // TODO change to displayName if message service is adjusted
			date,
			formatToHHMM(alias.timestamp)
		);
	}, [alias?.timestamp, alias?.username]);

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
	}, [displayName, isMyMessage, isUser, subscriberIsModerator]);

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
