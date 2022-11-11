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
import {
	STORAGE_KEY_ATTACHMENT_ENCRYPTION,
	useDevToolbar
} from '../devToolbar/DevToolbar';
import {
	NotificationsContext,
	NOTIFICATION_TYPE_ERROR
} from '../../globalState';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';

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
	const { getDevToolbarOption } = useDevToolbar();
	const { addNotification } = React.useContext(NotificationsContext);

	const [encryptedFile, setEncryptedFile] = React.useState(null);
	const [isDecrypting, setIsDecrypting] = React.useState(false);

	const decryptFile = useCallback(
		async (url: string) => {
			if (isDecrypting) return;
			const isAttachmentEncryptionEnabledDevTools = parseInt(
				getDevToolbarOption(STORAGE_KEY_ATTACHMENT_ENCRYPTION)
			);
			setIsDecrypting(true);

			const data = await fetchData({
				url: url,
				method: FETCH_METHODS.GET,
				responseHandling: [],
				headersData: {
					'Content-Type': ''
				}
			});

			const shouldDecrypt =
				encrypted &&
				props.t === 'e2e' &&
				isAttachmentEncryptionEnabledDevTools;
			const skipDecryption = !shouldDecrypt;
			let blobUrl;

			if (skipDecryption) {
				// not encrypted
				const blob = await data.blob();
				blobUrl = window.URL.createObjectURL(blob);
			} else {
				// encrypted
				const text = await data.text();
				const encryptedData = await decryptAttachment(
					text,
					props.attachment.title,
					keyID,
					key,
					false
				).catch((error) => {
					addNotification({
						notificationType: NOTIFICATION_TYPE_ERROR,
						title: translate('e2ee.attachment.error.title'),
						text: translate('e2ee.attachment.error.text'),
						closeable: true,
						timeout: 60000
					});

					apiPostError({
						name: error.name,
						message: error.message,
						stack: error.stack,
						level: ERROR_LEVEL_WARN
					}).then();

					throw new Error(error);
				});

				if (!encryptedData) return;

				const blobData = new Blob([encryptedData], {
					type: props.file.type
				});
				blobUrl = window.URL.createObjectURL(blobData);
			}

			setEncryptedFile(blobUrl);
			setIsDecrypting(false);
		},
		[
			isDecrypting,
			encrypted,
			key,
			keyID,
			props.attachment.title,
			props.t,
			props.file.type,
			getDevToolbarOption,
			addNotification,
			translate
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
					{isDecrypting ? (
						<LoadingSpinner />
					) : (
						getIconForAttachmentType(props.file.type)
					)}
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
			{props.t === 'e2e' && (
				<>
					{encryptedFile ? (
						<a
							href={encryptedFile}
							download={props.file.name}
							rel="noopener noreferer"
							className="messageItem__message__attachment__download"
						>
							<DownloadIcon />
							<p>{translate('e2ee.attachment.save')}</p>
						</a>
					) : (
						<button
							onClick={() =>
								decryptFile(
									apiUrl + props.attachment.title_link
								)
							}
							className="messageItem__message__attachment__download"
						>
							<p className={isDecrypting ? 'decrypting' : ''}>
								{translate(
									isDecrypting
										? 'e2ee.attachment.decrypting'
										: 'e2ee.attachment.decrypt'
								)}
							</p>
						</button>
					)}
				</>
			)}
			{props.t !== 'e2e' && (
				<a
					href={apiUrl + props.attachment.title_link}
					rel="noopener noreferer"
					className="messageItem__message__attachment__download"
				>
					<DownloadIcon />
					<p>{translate('attachments.download.label')}</p>
				</a>
			)}
		</div>
	);
};
