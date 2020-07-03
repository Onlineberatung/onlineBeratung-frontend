import { config } from '../../../resources/ts/config';
import { FETCH_METHODS } from './fetchData';
import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';
import { generateCsrfToken } from '../../../resources/ts/helpers/generateCsrfToken';

export const ajaxCallUploadAttachment = async (
	messageData: string,
	attachment: File,
	rcGroupId: string,
	isFeedback: boolean,
	sendMailNotification: boolean,
	uploadProgress: Function
): Promise<any> => {
	const accessToken = getTokenFromCookie('keycloak');
	const rcAuthToken = getTokenFromCookie('rc_token');
	const rcUid = getTokenFromCookie('rc_uid');
	const csrfToken = generateCsrfToken();

	const url = isFeedback
		? config.endpoints.attachmentUploadFeedbackRoom + rcGroupId
		: config.endpoints.attachmentUpload + rcGroupId;

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

	xhr.open(FETCH_METHODS.POST, url, true);
	xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
	xhr.setRequestHeader('rcToken', rcAuthToken);
	xhr.setRequestHeader('rcUserId', rcUid);
	xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
	xhr.setRequestHeader('cache-control', 'no-cache');

	xhr.send(data);

	return xhr;
};
