import {
	isDOCXAttachment,
	isJPEGAttachment,
	isPDFAttachment,
	isPNGAttachment,
	isXLSXAttachment,
	isAudioAttachment
} from '../messageSubmitInterface/attachmentHelpers';
import FileDocIcon from '@mui/icons-material/Article';
import FileImageIcon from '@mui/icons-material/Image';
import FilePdfIcon from '@mui/icons-material/PictureAsPdf';
import FileXlsIcon from '@mui/icons-material/TableChart';
import DocumentsIcon from '@mui/icons-material/ContentCopy';

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
