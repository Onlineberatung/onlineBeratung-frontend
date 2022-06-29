import {
	getChatItemForSession,
	isUserModerator
} from '../session/sessionHelpers';
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

export const MessageDisplayName = (props: MessageDisplayNameProps) => {
	const activeSession = useContext(ActiveSessionContext);
	const chatItem = getChatItemForSession(activeSession);

	const forwardedLabel = () => {
		const date = getPrettyDateFromMessageDate(
			Math.round(props.alias.timestamp / 1000)
		);
		return translate('message.forwardedLabel')(
			props.alias.username, // TODO change to displayName if message service is adjusted
			date,
			formatToHHMM(props.alias.timestamp)
		);
	};

	const subscriberIsModerator = isUserModerator({
		chatItem,
		rcUserId: props.userId
	});
	const currentUserIsModerator = isUserModerator({
		chatItem,
		rcUserId: getValueFromCookie('rc_uid')
	});

	const getUsernameWithPrefix = () => {
		if (props.isMyMessage) {
			return translate('message.isMyMessage.name');
		} else if (
			(!props.isMyMessage && props.isUser) ||
			(!subscriberIsModerator && props.isUser)
		) {
			return props.displayName;
		} else {
			return subscriberIsModerator
				? translate('session.groupChat.consultant.prefix') +
						props.displayName
				: translate('session.consultant.prefix') + props.displayName;
		}
	};

	return (
		<>
			{!props.alias && props.displayName && (
				<div
					className={`messageItem__username messageItem__username--${props.type}`}
				>
					{getUsernameWithPrefix()}
					{currentUserIsModerator && !subscriberIsModerator && (
						<FlyoutMenu
							position="right"
							isHidden={props.isUserBanned}
						>
							<BanUser
								userName={props.username}
								rcUserId={props.userId}
								chatId={activeSession?.chat?.id}
							/>
						</FlyoutMenu>
					)}
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
