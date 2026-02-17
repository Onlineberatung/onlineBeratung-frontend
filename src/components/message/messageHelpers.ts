import {
	isDOCXAttachment,
	isJPEGAttachment,
	isPDFAttachment,
	isPNGAttachment,
	isXLSXAttachment,
	isAudioAttachment
} from '../messageSubmitInterface/attachmentHelpers';
import FileDocIcon from '../../resources/img/icons/file-doc.svg?react';
import FileImageIcon from '../../resources/img/icons/file-image.svg?react';
import FilePdfIcon from '../../resources/img/icons/file-pdf.svg?react';
import FileXlsIcon from '../../resources/img/icons/file-xls.svg?react';
import DocumentsIcon from '../../resources/img/icons/documents.svg?react';

export const getIconForAttachmentType = (attachmentType: string) => {
	if (isJPEGAttachment(attachmentType) || isPNGAttachment(attachmentType)) {
		return FileImageIcon;
	} else if (isPDFAttachment(attachmentType)) {
		return FilePdfIcon;
	} else if (isDOCXAttachment(attachmentType)) {
		return FileDocIcon;
	} else if (isXLSXAttachment(attachmentType)) {
		return FileXlsIcon;
	} else if (isAudioAttachment(attachmentType)) {
		return DocumentsIcon; // Using generic documents icon for audio
	}
	return DocumentsIcon; // Default icon for unknown types
};
