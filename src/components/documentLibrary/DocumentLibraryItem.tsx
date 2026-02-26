import * as React from 'react';
import { useCallback, useContext, useState } from 'react';
import { List, ListItem, Divider } from '@mui/material';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { formatToDDMMYYYY } from '../../utils/dateHelpers';
import {
	isImageAttachment,
	isPDFAttachment,
	ATTACHMENT_TRANSLATE_FOR_TYPE,
	getAttachmentSizeMBForKB
} from '../messageSubmitInterface/attachmentHelpers';
import {
	decryptAttachment,
	ENCRYPTION_VERSION_ACTIVE,
	KEY_ID_LENGTH,
	MAX_PREFIX_LENGTH,
	VECTOR_LENGTH,
	VERSION_SEPERATOR
} from '../../utils/encryptionHelpers';
import { getIconForAttachmentType } from '../message/messageHelpers';
import { AttachmentModal } from '../message/AttachmentModal';
import { apiUrl } from '../../resources/scripts/endpoints';
import { FETCH_METHODS, fetchData } from '../../api';
import { useE2EE } from '../../hooks/useE2EE';
import {
	NotificationsContext,
	NOTIFICATION_TYPE_ERROR,
	ActiveSessionContext
} from '../../globalState';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import './documentLibrary.styles.scss';

export interface DocumentItem {
	attachment: MessageService.Schemas.AttachmentDTO;
	file: MessageService.Schemas.FileDTO;
	t: string;
	ts?: string;
}

const NOT_ENCRYPTED = 'not_encrypted';
const IS_DECRYPTING = 'is_decrypting';
const DECRYPTION_ERROR = 'decryption_error';
const DECRYPTION_FINISHED = 'decryption_finished';

interface DocumentListItemProps {
	doc: DocumentItem;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({ doc }) => {
	const { t: translate } = useTranslation();
	const { activeSession } = useContext(ActiveSessionContext);
	const { key, keyID } = useE2EE(activeSession.rid);
	const { addNotification } = useContext(NotificationsContext);

	const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
	const [attachmentStatus, setAttachmentStatus] = useState(
		doc.t === 'e2e' ? 'encrypted' : NOT_ENCRYPTED
	);
	const [modalOpen, setModalOpen] = useState(false);

	const isImage = isImageAttachment(doc.file.type);
	const isPDF = isPDFAttachment(doc.file.type);
	const canPreview = isImage || isPDF;

	const decryptFile = useCallback(async (): Promise<string | null> => {
		if (
			attachmentStatus === IS_DECRYPTING ||
			attachmentStatus === DECRYPTION_ERROR
		) {
			return null;
		}
		if (attachmentStatus === DECRYPTION_FINISHED && decryptedUrl) {
			return decryptedUrl;
		}

		setAttachmentStatus(IS_DECRYPTING);

		try {
			const data = await fetchData({
				url: apiUrl + doc.attachment.title_link,
				method: FETCH_METHODS.GET,
				responseHandling: [],
				headersData: { 'Content-Type': '' }
			});

			const text = await data.text();
			const decryptedData = await decryptAttachment(
				text,
				doc.attachment.title,
				keyID,
				key
			);

			const blobUrl = window.URL.createObjectURL(
				new Blob([decryptedData], { type: doc.file.type })
			);

			setDecryptedUrl(blobUrl);
			setAttachmentStatus(DECRYPTION_FINISHED);
			return blobUrl;
		} catch (error) {
			setAttachmentStatus(DECRYPTION_ERROR);
			addNotification({
				notificationType: NOTIFICATION_TYPE_ERROR,
				title: translate('e2ee.attachment.error.title'),
				text: translate('e2ee.attachment.error.text'),
				closeable: true,
				timeout: 60000
			});
			return null;
		}
	}, [
		attachmentStatus,
		decryptedUrl,
		doc.attachment.title_link,
		doc.attachment.title,
		doc.file.type,
		key,
		keyID,
		addNotification,
		translate
	]);

	const handleView = useCallback(async () => {
		let url = decryptedUrl;
		if (!url) {
			url = await decryptFile();
		}
		if (url) {
			setModalOpen(true);
		}
	}, [decryptedUrl, decryptFile]);

	const handleDownload = useCallback(async () => {
		let url = decryptedUrl;
		if (!url) {
			url = await decryptFile();
		}
		if (url) {
			const a = document.createElement('a');
			a.href = url;
			a.download = doc.file.name;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}, [decryptedUrl, decryptFile, doc.file.name]);

	const getFileIcon = () => {
		const Icon = getIconForAttachmentType(doc.file.type);
		return Icon ? <Icon aria-hidden="true" focusable="false" /> : null;
	};

	const fileSizeDisplay = doc.attachment.image_size
		? `${(
				getAttachmentSizeMBForKB(
					doc.t === 'e2e'
						? Math.floor(
								(doc.attachment.image_size -
									KEY_ID_LENGTH -
									MAX_PREFIX_LENGTH -
									VERSION_SEPERATOR.length -
									ENCRYPTION_VERSION_ACTIVE.length -
									100) /
									2 -
									VECTOR_LENGTH * 2
							) * 1000
						: doc.attachment.image_size * 1000
				) / 1000
			).toFixed(2)}${translate('attachments.type.label.mb')}`
		: null;

	const isDecrypting = attachmentStatus === IS_DECRYPTING;
	const hasError = attachmentStatus === DECRYPTION_ERROR;

	return (
		<ListItem className="documentLibrary__item">
			<div className="documentLibrary__itemIcon">
				{isDecrypting ? <LoadingSpinner /> : getFileIcon()}
			</div>
			<div className="documentLibrary__itemInfo">
				<span className="documentLibrary__itemName">
					{doc.attachment.title}
				</span>
				<span className="documentLibrary__itemMeta">
					{translate(ATTACHMENT_TRANSLATE_FOR_TYPE[doc.file.type])}
					{fileSizeDisplay && ` | ${fileSizeDisplay}`}
				</span>
				{doc.ts && (
					<span className="documentLibrary__itemDate">
						{translate('documentLibrary.sentAt', {
							date: formatToDDMMYYYY(parseInt(doc.ts))
						})}
					</span>
				)}
				{hasError && (
					<span className="documentLibrary__itemError">
						{translate('e2ee.attachment.decryption_error')}
					</span>
				)}
			</div>
			<div className="documentLibrary__itemActions">
				{canPreview && (
					<IconButton
						onClick={handleView}
						aria-label={translate('attachments.preview.label')}
						size="small"
						className="documentLibrary__actionButton"
						disabled={isDecrypting || hasError}
					>
						<PreviewIcon />
					</IconButton>
				)}
				<IconButton
					onClick={handleDownload}
					aria-label={translate('attachments.download.label')}
					size="small"
					className="documentLibrary__actionButton"
					disabled={isDecrypting || hasError}
				>
					<DownloadIcon />
				</IconButton>
			</div>
			{(isImage || isPDF) && (
				<AttachmentModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					type={isImage ? 'image' : 'pdf'}
					src={decryptedUrl}
					title={doc.attachment.title}
				/>
			)}
		</ListItem>
	);
};

interface DocumentListProps {
	documents: DocumentItem[];
	emptyLabel: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
	documents,
	emptyLabel
}) => {
	if (documents.length === 0) {
		return (
			<div className="documentLibraryPage__empty">{emptyLabel}</div>
		);
	}

	return (
		<List className="documentLibrary__list">
			{documents.map((doc, index) => (
				<React.Fragment key={`${doc.file._id}-${index}`}>
					{index > 0 && <Divider />}
					<DocumentListItem doc={doc} />
				</React.Fragment>
			))}
		</List>
	);
};
