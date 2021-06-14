import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../components/error/errorHandling';

export const fetchRCData = (
	url: string,
	method: string,
	bodyData: any = null,
	ignoreErrors: boolean = false
): Promise<any> =>
	new Promise((resolve, reject) => {
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

		fetch(req)
			.then((response) => {
				if (response.status === 200) {
					const data = response.json();
					resolve(data);
				} else if (!ignoreErrors) {
					const error = getErrorCaseForStatus(response.status);
					redirectToErrorPage(error);
					reject(new Error('api call error'));
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
