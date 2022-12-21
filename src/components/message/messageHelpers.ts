import {
	isDOCXAttachment,
	isJPEGAttachment,
	isPDFAttachment,
	isPNGAttachment,
	isXLSXAttachment
} from '../messageSubmitInterface/attachmentHelpers';
import { ReactComponent as FileDocIcon } from '../../resources/img/icons/file-doc.svg';
import { ReactComponent as FileImageIcon } from '../../resources/img/icons/file-image.svg';
import { ReactComponent as FilePdfIcon } from '../../resources/img/icons/file-pdf.svg';
import { ReactComponent as FileXlsIcon } from '../../resources/img/icons/file-xls.svg';

export const isVoluntaryInfoSet = (sessionData, resortData) => {
	if (sessionData && resortData) {
		const sessionDataCopy = Object.assign({}, sessionData);
		if (resortData.requiredComponents) {
			Object.keys(resortData.requiredComponents).forEach((key) => {
				delete sessionDataCopy[key];
			});
		}
		const values = Object.values(sessionDataCopy);
		return values.some((value) => !!value);
	}

	return false;
};

export const getIconForAttachmentType = (attachmentType: string) => {
	if (isJPEGAttachment(attachmentType) || isPNGAttachment(attachmentType)) {
		return FileImageIcon;
	} else if (isPDFAttachment(attachmentType)) {
		return FilePdfIcon;
	} else if (isDOCXAttachment(attachmentType)) {
		return FileDocIcon;
	} else if (isXLSXAttachment(attachmentType)) {
		return FileXlsIcon;
	}
};
