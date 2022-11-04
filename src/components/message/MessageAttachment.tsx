import * as React from 'react';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../messageSubmitInterface/attachmentHelpers';
import { getIconForAttachmentType } from '../messageSubmitInterface/messageSubmitInterfaceComponent';
import { ReactComponent as DownloadIcon } from '../../resources/img/icons/download.svg';
import { useTranslation } from 'react-i18next';
import { apiUrl } from '../../resources/scripts/endpoints';
import { useCallback } from 'react';
import { FETCH_METHODS, fetchData } from '../../api';
import { decryptAttachment } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { useAppConfig } from '../../hooks/useAppConfig';
import { STORAGE_KEY_ATTACHMENT_ENCRYPTION } from '../devToolbar/DevToolbar';

interface MessageAttachmentProps {
	attachment: MessageService.Schemas.AttachmentDTO;
	file: MessageService.Schemas.FileDTO;
	hasRenderedMessage: boolean;
	rid: string;
	t?: string;
}

export const MessageAttachment = (props: MessageAttachmentProps) => {
	const { t: translate } = useTranslation();
	const { key, keyID, encrypted } = useE2EE(props.rid);
	const settings = useAppConfig();
	const isAttachmentEncryptionEnabledDevTools =
		localStorage.getItem(STORAGE_KEY_ATTACHMENT_ENCRYPTION) === null
			? settings.attachmentEncryption
			: parseInt(localStorage.getItem(STORAGE_KEY_ATTACHMENT_ENCRYPTION));

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
				.then((result) => {
					return result.text();
				})
				.then((result: string) => {
					const shouldDecrypt =
						encrypted &&
						props.t === 'e2e' &&
						isAttachmentEncryptionEnabledDevTools;
					const skipDecryption = !shouldDecrypt;
					return decryptAttachment(
						result,
						props.attachment.title,
						keyID,
						key,
						!skipDecryption
					);
				})
				.then((file: File) => {
					const blobUrl = URL.createObjectURL(file);
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
		[
			encrypted,
			key,
			keyID,
			props.attachment.title,
			props.t,
			isAttachmentEncryptionEnabledDevTools
		]
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
			<button
				onClick={() =>
					downloadViaJavascript(apiUrl + props.attachment.title_link)
				}
				className="messageItem__message__attachment__download"
			>
				<DownloadIcon />
				<p>{translate('attachments.download.label')}</p>
			</button>
		</div>
	);
};
