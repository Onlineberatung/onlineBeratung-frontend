import { config, CSRF_WHITELIST_HEADER } from '../resources/scripts/config';
import { FETCH_METHODS } from './fetchData';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { generateCsrfToken } from '../utils/generateCsrfToken';

const nodeEnv: string = process.env.NODE_ENV as string;
const isLocalDevelopment = nodeEnv === 'development';

// message can not be send encrypted,
// since we can not set the t:e2e param in rocket.chat
export const apiUploadAttachment = (
	attachment: File,
	rcGroupIdOrSessionId: string | number,
	isFeedback: boolean,
	sendMailNotification: boolean,
	uploadProgress: Function,
	handleXhr: (xhr) => void
) =>
	new Promise((resolve, reject) => {
		const accessToken = getValueFromCookie('keycloak');
		const rcAuthToken = getValueFromCookie('rc_token');
		const rcUid = getValueFromCookie('rc_uid');
		const csrfToken = generateCsrfToken();

		const url = isFeedback
			? config.endpoints.attachmentUploadFeedbackRoom +
			  rcGroupIdOrSessionId
			: config.endpoints.attachmentUpload + rcGroupIdOrSessionId;

		let data = new FormData();
		data.append('file', attachment);
		data.append('sendNotification', sendMailNotification.toString());

		const xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.upload.onprogress = (e) => {
			let percentUpload = Math.min(
				Math.ceil((100 * e.loaded) / e.total),
				100
			);
			uploadProgress(percentUpload);
		};

		xhr.onload = (e) => {
			if ((e.target as XMLHttpRequest)?.status === 201) {
				resolve(e.target);
			} else {
				reject(e.target);
			}
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

		handleXhr(xhr);
	});
