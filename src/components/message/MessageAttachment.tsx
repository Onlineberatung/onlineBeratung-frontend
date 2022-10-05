import * as React from 'react';
import { translate } from '../../utils/translate';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../messageSubmitInterface/attachmentHelpers';
import { getIconForAttachmentType } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { apiUrl } from '../../resources/scripts/config';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { useCallback } from 'react';
import { FETCH_METHODS, fetchData } from '../../api';
import { decryptAttachment } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';

interface MessageAttachmentProps {
	attachment: MessageService.Schemas.AttachmentDTO;
	file: MessageService.Schemas.FileDTO;
	hasRenderedMessage: boolean;
	rid: string;
}

export const MessageAttachment = (props: MessageAttachmentProps) => {
	const { key, keyID, encrypted } = useE2EE(props.rid);

	const downloadViaJavascript = useCallback(
		(url: string) => {
			fetchData({
				url: url,
				method: FETCH_METHODS.GET,
				responseHandling: [],
				headersData: {
					'Content-Type': ''
				}
			})
				.then((result) => result.text())
				.then((result: string) =>
					decryptAttachment(
						result,
						props.attachment.title,
						keyID,
						key,
						encrypted
					)
				)
				.then((result) => {
					const blobUrl = URL.createObjectURL(result);
					const link = document.createElement('a');

					link.href = blobUrl;
					link.download = props.attachment.title;

					document.body.appendChild(link);
					link.dispatchEvent(
						new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
							view: window
						})
					);
					document.body.removeChild(link);
				});
		},
		[encrypted, key, keyID, props.attachment.title]
	);

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
						{ATTACHMENT_TRANSLATE_FOR_TYPE[props.file.type]}{' '}
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
			<button
				onClick={() =>
					downloadViaJavascript(apiUrl + props.attachment.title_link)
				}
			>
				Download
			</button>
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
