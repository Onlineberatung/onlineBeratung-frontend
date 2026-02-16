export const ATTACHMENT_TYPE_FOR_KEY = {
	PNG: 'image/png',
	JPEG: 'image/jpeg',
	PDF: 'application/pdf',
	DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	MP3: 'audio/mpeg',
	WAV: 'audio/wav',
	OGG: 'audio/ogg',
	M4A: 'audio/mp4'
};

export const ATTACHMENT_TRANSLATE_FOR_TYPE = {
	'image/png': 'attachments.type.label.png',
	'image/jpeg': 'attachments.type.label.jpeg',
	'application/pdf': 'attachments.type.label.pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'attachments.type.label.docx',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		'attachments.type.label.xlsx',
	'audio/mpeg': 'attachments.type.label.mp3',
	'audio/wav': 'attachments.type.label.wav',
	'audio/ogg': 'attachments.type.label.ogg',
	'audio/mp4': 'attachments.type.label.m4a'
};

export const isPNGAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.PNG;
export const isJPEGAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.JPEG;
export const isPDFAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.PDF;
export const isDOCXAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.DOCX;
export const isXLSXAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.XLSX;
export const isMP3Attachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.MP3;
export const isWAVAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.WAV;
export const isOGGAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.OGG;
export const isM4AAttachment = (type: string) =>
	type === ATTACHMENT_TYPE_FOR_KEY.M4A;

export const isImageAttachment = (type: string) =>
	isPNGAttachment(type) || isJPEGAttachment(type);

export const isAudioAttachment = (type: string) =>
	isMP3Attachment(type) ||
	isWAVAttachment(type) ||
	isOGGAttachment(type) ||
	isM4AAttachment(type);

export const ATTACHMENT_MAX_SIZE_IN_MB = 10;

export const getAttachmentSizeMBForKB = (attachmentSizeKB: number) => {
	return parseInt(Math.ceil(attachmentSizeKB / Math.pow(1000, 2)).toFixed(2));
};
