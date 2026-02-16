import * as React from 'react';
import {
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB,
	isImageAttachment,
	isPDFAttachment,
	isAudioAttachment
} from '../messageSubmitInterface/attachmentHelpers';
import DownloadIcon from '../../resources/img/icons/download.svg?react';
import { useTranslation } from 'react-i18next';
import { apiUrl } from '../../resources/scripts/endpoints';
import { useCallback, useRef, useState } from 'react';
import { FETCH_METHODS, fetchData } from '../../api';
import {
	decryptAttachment,
	ENCRYPTION_VERSION_ACTIVE,
	KEY_ID_LENGTH,
	MAX_PREFIX_LENGTH,
	VECTOR_LENGTH,
	VERSION_SEPERATOR
} from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import {
	NotificationsContext,
	NOTIFICATION_TYPE_ERROR
} from '../../globalState';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import clsx from 'clsx';
import { getIconForAttachmentType } from './messageHelpers';
import { AttachmentModal } from './AttachmentModal';

interface MessageAttachmentProps {
	attachment: MessageService.Schemas.AttachmentDTO;
	file: MessageService.Schemas.FileDTO;
	hasRenderedMessage: boolean;
	rid: string;
	t?: string;
}

const NOT_ENCRYPTED = 'not_encrypted';
const ENCRYPTED = 'encrypted';
const IS_DECRYPTING = 'is_decrypting';
const DECRYPTION_ERROR = 'decryption_error';
const DECRYPTION_FINISHED = 'decryption_finished';

export const MessageAttachment = (props: MessageAttachmentProps) => {
	const { t: translate } = useTranslation();
	const { key, keyID, encrypted } = useE2EE(props.rid);
	const { addNotification } = React.useContext(NotificationsContext);

	const [encryptedFile, setEncryptedFile] = React.useState(null);
	const [attachmentStatus, setAttachmentStatus] = React.useState(
		props.t === 'e2e' ? ENCRYPTED : NOT_ENCRYPTED
	);
	const [modalOpen, setModalOpen] = useState(false);
	const currentDownloadLink = useRef<any>();
	const audioRef = useRef<HTMLAudioElement>(null);

	const isImage = isImageAttachment(props.file.type);
	const isPDF = isPDFAttachment(props.file.type);
	const isAudio = isAudioAttachment(props.file.type);
	const canPreview = isImage || isPDF || isAudio;

	// For 100% E2EE app: Always decrypt e2e messages
	// Maintain backward compatibility: old non-e2e messages (props.t !== 'e2e') will work as before
	const isEncrypted = props.t === 'e2e';

	const decryptFile = useCallback(
		async (url: string) => {
			if (
				attachmentStatus === IS_DECRYPTING ||
				attachmentStatus === DECRYPTION_ERROR
			)
				return;
			setAttachmentStatus(IS_DECRYPTING);

			const data = await fetchData({
				url: url,
				method: FETCH_METHODS.GET,
				responseHandling: [],
				headersData: {
					'Content-Type': ''
				}
			});

			let blobUrl;

			if (!isEncrypted) {
				// Backward compatibility: old non-encrypted messages
				const blob = await data.blob();
				blobUrl = window.URL.createObjectURL(blob);
			} else {
				// Decrypt E2EE attachment
				const text = await data.text();
				const encryptedData = await decryptAttachment(
					text,
					props.attachment.title,
					keyID,
					key
				).catch((error) => {
					setAttachmentStatus(DECRYPTION_ERROR);

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

					return null;
				});

				if (!encryptedData) {
					return;
				}

				const blobData = new Blob([encryptedData], {
					type: props.file.type
				});
				blobUrl = window.URL.createObjectURL(blobData);
			}

			setEncryptedFile(blobUrl);
			setAttachmentStatus(DECRYPTION_FINISHED);
		},
		[
			attachmentStatus,
			isEncrypted,
			key,
			keyID,
			props.attachment.title,
			props.file.type,
			addNotification,
			translate
		]
	);

	const getAttachmentIcon = useCallback((type: string) => {
		const Icon = getIconForAttachmentType(type);
		if (Icon) {
			return <Icon aria-hidden="true" focusable="false" />;
		}
		return null;
	}, []);

	const handlePreviewClick = useCallback(async () => {
		if (isAudio) {
			// For audio, just toggle play/pause
			if (audioRef.current) {
				if (audioRef.current.paused) {
					audioRef.current.play();
				} else {
					audioRef.current.pause();
				}
			}
		} else if (isImage || isPDF) {
			// For images and PDFs, decrypt if needed then open modal
			if (isEncrypted && !encryptedFile) {
				await decryptFile(apiUrl + props.attachment.title_link);
			}
			setModalOpen(true);
		}
	}, [isAudio, isImage, isPDF, isEncrypted, encryptedFile, decryptFile, props.attachment.title_link]);

	const handleModalClose = useCallback(() => {
		setModalOpen(false);
	}, []);

	const getPreviewUrl = useCallback(() => {
		// For encrypted attachments, return decrypted blob URL
		if (isEncrypted && encryptedFile) {
			return encryptedFile;
		}
		// For non-encrypted attachments (backward compatibility for old messages), use direct URL
		if (!isEncrypted) {
			return apiUrl + props.attachment.title_link;
		}
		// For encrypted attachments not yet decrypted, return null (should not reach here)
		return null;
	}, [isEncrypted, encryptedFile, props.attachment.title_link]);

	const attachmentAriaLabel = () => {
		if (
			isEncrypted &&
			encryptedFile &&
			attachmentStatus === DECRYPTION_FINISHED
		)
			return translate('e2ee.attachment.save');
		else if (isEncrypted && attachmentStatus !== DECRYPTION_FINISHED)
			return translate(`e2ee.attachment.${attachmentStatus}`);
		else return translate('attachments.download.label');
	};

	return (
		<div
			className={
				props.hasRenderedMessage
					? 'messageItem__message--withAttachment'
					: ''
			}
		>
			{/* Image Preview */}
			{isImage && (
				<div className="messageItem__message__attachment__preview">
					<button
						onClick={handlePreviewClick}
						className="messageItem__message__attachment__preview__button"
						aria-label={translate('attachments.preview.label')}
					>
						{attachmentStatus === IS_DECRYPTING ? (
							<LoadingSpinner />
						) : (attachmentStatus === DECRYPTION_FINISHED && encryptedFile) || !isEncrypted ? (
							<img
								src={getPreviewUrl()}
								alt={props.attachment.title}
								className="messageItem__message__attachment__preview__image"
							/>
						) : (
							<div className="messageItem__message__attachment__preview__placeholder">
								{getAttachmentIcon(props.file.type)}
								<span>{translate('e2ee.attachment.encrypted')}</span>
							</div>
						)}
					</button>
				</div>
			)}

			{/* Audio Player */}
			{isAudio && ((attachmentStatus === DECRYPTION_FINISHED && encryptedFile) || !isEncrypted) && (
				<div className="messageItem__message__attachment__audio">
					<audio
						ref={audioRef}
						controls
						className="messageItem__message__attachment__audio__player"
						preload="metadata"
					>
						<source src={getPreviewUrl()} type={props.file.type} />
						{translate('attachments.audio.unsupported')}
					</audio>
				</div>
			)}

			{/* Attachment Info Button */}
			<button
				aria-label={attachmentAriaLabel()}
				onClick={() => {
					if (canPreview && !isAudio) {
						handlePreviewClick();
					} else {
						currentDownloadLink.current.click();
					}
				}}
				className="messageItem__message__attachment"
			>
				<span className="messageItem__message__attachment__icon">
					{attachmentStatus === IS_DECRYPTING ? (
						<LoadingSpinner />
					) : (
						getAttachmentIcon(props.file.type)
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
											props.t === 'e2e'
												? Math.floor(
														(props.attachment
															.image_size -
															KEY_ID_LENGTH -
															MAX_PREFIX_LENGTH -
															VERSION_SEPERATOR.length -
															ENCRYPTION_VERSION_ACTIVE.length -
															100) /
															2 -
															VECTOR_LENGTH * 2
													) * 1000
												: props.attachment.image_size *
														1000
										) / 1000
									).toFixed(2) +
									translate('attachments.type.label.mb')
								}`
							: null}
					</p>
				</span>
			</button>

			{/* Download Links */}
			{isEncrypted ? (
				<>
					{encryptedFile &&
					attachmentStatus === DECRYPTION_FINISHED ? (
						<a
							ref={currentDownloadLink}
							href={encryptedFile}
							download={props.file.name}
							rel="noopener noreferer"
							className="messageItem__message__attachment__download"
						>
							<DownloadIcon
								title={translate('app.download')}
								aria-label={translate('app.download')}
							/>
							<p>{translate('e2ee.attachment.save')}</p>
						</a>
					) : (
						<button
							ref={currentDownloadLink}
							onClick={() =>
								decryptFile(
									apiUrl + props.attachment.title_link
								)
							}
							className="messageItem__message__attachment__download"
						>
							<p
								className={clsx({
									decrypting:
										attachmentStatus === IS_DECRYPTING,
									decryptionError:
										attachmentStatus === DECRYPTION_ERROR
								})}
							>
								{translate(
									`e2ee.attachment.${attachmentStatus}`
								)}
							</p>
						</button>
					)}
				</>
			) : (
				<a
					ref={currentDownloadLink}
					href={apiUrl + props.attachment.title_link}
					rel="noopener noreferer"
					download={props.file.name}
					className="messageItem__message__attachment__download"
				>
					<DownloadIcon
						title={translate('app.download')}
						aria-label={translate('app.download')}
					/>
					<p>{translate('attachments.download.label')}</p>
				</a>
			)}

			{/* Attachment Modal for Images and PDFs */}
			{(isImage || isPDF) && (
				<AttachmentModal
					open={modalOpen}
					onClose={handleModalClose}
					type={isImage ? 'image' : 'pdf'}
					src={getPreviewUrl()}
					title={props.attachment.title}
				/>
			)}
		</div>
	);
};
