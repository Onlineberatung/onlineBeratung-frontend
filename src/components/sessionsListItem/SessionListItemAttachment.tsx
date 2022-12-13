import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { getIconForAttachmentType } from '../message/messageHelpers';

interface SessionListItemAttachmentProps {
	attachment: UserService.Schemas.SessionAttachmentDTO;
}

export const SessionListItemAttachment = (
	props: SessionListItemAttachmentProps
) => {
	const { t: translate } = useTranslation();

	const getAttachmentIcon = useCallback((type: string) => {
		const Icon = getIconForAttachmentType(type);
		if (Icon) {
			return <Icon aria-hidden="true" focusable="false" />;
		}
		return null;
	}, []);

	return (
		<div className="sessionsListItem__subject">
			<span className="sessionsListItem__subject__attachment">
				{getAttachmentIcon(props.attachment.fileType)}
			</span>
			<span>
				{props.attachment.fileReceived
					? translate('attachments.list.label.received')
					: translate('attachments.list.label.sent')}
			</span>
		</div>
	);
};
