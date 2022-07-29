import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../components/error/errorHandling';

export const fetchRCData = (
	url: string,
	method: string,
	bodyData: string = null,
	ignoreErrors: boolean = false
): Promise<any> => {
	const rcAuthToken = getValueFromCookie('rc_token');
	const rcUid = getValueFromCookie('rc_uid');

	const req = new Request(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'cache-control': 'no-cache',
			'X-Auth-Token': rcAuthToken,
			'X-User-Id': rcUid
		},
		credentials: 'include',
		body: bodyData
	});

	return fetch(req).then((response) => {
		if (response.status === 200) {
			return response.json();
		} else if (!ignoreErrors) {
			const error = getErrorCaseForStatus(response.status);
			redirectToErrorPage(error);
			throw new Error('api call error');
		}
	});
};
