import * as React from 'react';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../messageSubmitInterface/attachmentHelpers';
import { getIconForAttachmentType } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { useTranslation } from 'react-i18next';
import { apiUrl } from '../../resources/scripts/endpoints';

interface MessageAttachmentProps {
	attachment: MessageService.Schemas.AttachmentDTO;
	file: MessageService.Schemas.FileDTO;
	hasRenderedMessage: boolean;
}

export const MessageAttachment = (props: MessageAttachmentProps) => {
	const { t: translate } = useTranslation();

	return (
		<div
			className={
				props.hasRenderedMessage
					? 'messageItem__message--withAttachment'
					: ''
			}
		>
			<div className="messageItem__message__attachment">
				<span className="messageItem__message__attachment__icon">
					{getIconForAttachmentType(props.file.type)}
				</span>
				<span className="messageItem__message__attachment__title">
					<p>{props.attachment.title}</p>
					<p className="messageItem__message__attachment__meta">
						{translate(
							ATTACHMENT_TRANSLATE_FOR_TYPE[props.file.type]
						)}{' '}
						{props.attachment.image_size
							? `| ${
									(
										getAttachmentSizeMBForKB(
											props.attachment.image_size * 1000
										) / 1000
									).toFixed(2) +
									translate('attachments.type.label.mb')
							  }`
							: null}
					</p>
				</span>
			</div>
			<a
				href={apiUrl + props.attachment.title_link}
				rel="noopener noreferer"
				className="messageItem__message__attachment__download"
			>
				<DownloadIcon />
				<p>{translate('attachments.download.label')}</p>
			</a>
		</div>
	);
};
