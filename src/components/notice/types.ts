export const NOTICE_TYPE_ERROR = 'error';
export type NoticeTypeError = typeof NOTICE_TYPE_ERROR;

export const NOTICE_TYPE_WARNING = 'warning';
export type NoticeTypeWarning = typeof NOTICE_TYPE_WARNING;

export const NOTICE_TYPE_INFO = 'info';
export type NoticeTypeInfo = typeof NOTICE_TYPE_INFO;

export const NOTICE_TYPE_SUCCESS = 'success';
export type NoticeTypeSuccess = typeof NOTICE_TYPE_SUCCESS;

export type NoticeTypes =
	| NoticeTypeError
	| NoticeTypeInfo
	| NoticeTypeWarning
	| NoticeTypeSuccess;
