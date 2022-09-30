import React from 'react';
import { useCallback, useContext } from 'react';
import {
	NotificationsContext,
	NOTIFICATION_TYPE_SUCCESS
} from '../../globalState';
import { CopyIcon } from '../../resources/img/icons';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { translate } from '../../utils/translate';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import './groupChatCopyLinks.scss';
import { appConfig } from '../../utils/appConfig';

type GroupChatCopyLinksProps = {
	id: number;
	groupChatId: string;
};

export const GroupChatCopyLinks = ({
	id,
	groupChatId
}: GroupChatCopyLinksProps) => {
	const url = `${appConfig.urls.toLogin}?gcid=${id}`;
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
