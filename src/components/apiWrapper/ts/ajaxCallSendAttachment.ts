import { config } from '../../../resources/ts/config';
import { FETCH_METHODS } from './fetchData';
import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';

export const ajaxCallSendAttachment = (
	attachment: File,
	rcGroupId: string,
	uploadProgress: Function
) => {
	const rcAuthToken = getTokenFromCookie('rc_token');
	const rcUid = getTokenFromCookie('rc_uid');
	const url = config.endpoints.rocketchatUploadAttachment + rcGroupId;

	let data = new FormData();
	data.append('file', attachment);

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.upload.onprogress = (e) => {
		let percentUpload = Math.ceil((100 * e.loaded) / e.total);
		uploadProgress(percentUpload);
	};

	xhr.open(FETCH_METHODS.POST, url, true);
	xhr.setRequestHeader('X-Auth-Token', rcAuthToken);
	xhr.setRequestHeader('X-User-Id', rcUid);
	xhr.setRequestHeader('cache-control', 'no-cache');

	xhr.send(data);

	return xhr;
};
