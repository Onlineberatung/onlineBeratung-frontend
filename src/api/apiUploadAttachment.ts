import { config, CSRF_WHITELIST_HEADER } from '../resources/scripts/config';
import { FETCH_METHODS } from './fetchData';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { generateCsrfToken } from '../utils/generateCsrfToken';

const nodeEnv: string = process.env.NODE_ENV as string;
const isLocalDevelopment = nodeEnv === 'development';

export const apiUploadAttachment = (
	messageData: string,
	attachment: File,
	rcGroupIdOrSessionId: string | number,
	isFeedback: boolean,
	sendMailNotification: boolean,
	uploadProgress: Function,
	onLoadHandling: Function
) => {
	const accessToken = getValueFromCookie('keycloak');
	const rcAuthToken = getValueFromCookie('rc_token');
	const rcUid = getValueFromCookie('rc_uid');
	const csrfToken = generateCsrfToken();

	const url = isFeedback
		? config.endpoints.attachmentUploadFeedbackRoom + rcGroupIdOrSessionId
		: config.endpoints.attachmentUpload + rcGroupIdOrSessionId;

	let data = new FormData();
	data.append('file', attachment);
	data.append('msg', messageData.trim());
	data.append('sendNotification', sendMailNotification.toString());

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.upload.onprogress = (e) => {
		let percentUpload = Math.ceil((100 * e.loaded) / e.total);
		uploadProgress(percentUpload);
	};

	xhr.onload = (e) => {
		onLoadHandling(e.target);
	};

	xhr.open(FETCH_METHODS.POST, url, true);
	xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
	xhr.setRequestHeader('rcToken', rcAuthToken);
	xhr.setRequestHeader('rcUserId', rcUid);
	xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
	xhr.setRequestHeader('cache-control', 'no-cache');
	if (isLocalDevelopment) {
		xhr.setRequestHeader(CSRF_WHITELIST_HEADER, csrfToken);
	}

	xhr.send(data);

	return xhr;
};
