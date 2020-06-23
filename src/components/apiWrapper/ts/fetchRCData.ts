import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../../errorPage/ts/errorHandling';

export const fetchRCData = (
	url: string,
	method: string,
	bodyData: any = null
): Promise<any> =>
	new Promise((resolve, reject) => {
		const rcAuthToken = getTokenFromCookie('rc_token');
		const rcUid = getTokenFromCookie('rc_uid');

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
				} else {
					const error = getErrorCaseForStatus(response.status);
					redirectToErrorPage(error);
					reject(new Error('api call error'));
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
