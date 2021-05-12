import * as React from 'react';
import { translate } from '../../utils/translate';
import { getIconForAttachmentType } from '../messageSubmitInterface/messageSubmitInterfaceComponent';

interface SessionListItemAttachmentProps {
	attachment: UserService.Schemas.SessionAttachmentDTO;
}

export const SessionListItemAttachment = (
	props: SessionListItemAttachmentProps
) => {
	return (
		<div className="sessionsListItem__subject">
			<span className="sessionsListItem__subject__attachment">
				{getIconForAttachmentType(props.attachment.fileType)}
			</span>
			<span>
				{props.attachment.fileReceived
					? translate('attachments.list.label.received')
					: translate('attachments.list.label.sent')}
			</span>
		</div>
	);
};
