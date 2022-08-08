import React from 'react';
import { useCallback, useContext } from 'react';
import {
	NotificationsContext,
	NOTIFICATION_TYPE_SUCCESS
} from '../../globalState';
import { CopyIcon } from '../../resources/img/icons';
import { config } from '../../resources/scripts/config';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { translate } from '../../utils/translate';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import './groupChatCopyLinks.scss';

type GroupChatCopyLinksProps = {
	groupChatId: string;
};

export const GroupChatCopyLinks = ({
	groupChatId
}: GroupChatCopyLinksProps) => {
	const url = `${config.urls.registration}?gcid=${groupChatId}`;
	const { addNotification } = useContext(NotificationsContext);

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(url, () => {
			addNotification({
				notificationType: NOTIFICATION_TYPE_SUCCESS,

				title: translate('groupChat.copy.link.notification.title'),
				text: translate('groupChat.copy.link.notification.text')
			});
		});
	}, [url, addNotification]);

	return (
		<div className="GroupChatCopyLinks">
			<div className="GroupChatCopyLinks_qrCode">
				<GenerateQrCode
					url={url}
					headline={translate('groupChat.qrCode.headline')}
					text={translate('groupChat.qrCode.text')}
					filename={`group-chat-${groupChatId}`}
				/>
			</div>
			<div className="GroupChatCopyLinks_copyLink">
				<span
					className="profile__data__copy_registration_link text--nowrap text--tertiary primary mr--2"
					role="button"
					onClick={copyRegistrationLink}
					title={translate('groupChat.copy.link.title')}
				>
					<CopyIcon className={`copy icn--s`} />{' '}
					{translate('groupChat.copy.link.text')}
				</span>
			</div>
		</div>
	);
};
