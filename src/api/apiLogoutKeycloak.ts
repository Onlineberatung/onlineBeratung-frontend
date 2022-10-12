import { endpoints } from '../resources/scripts/endpoints';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../components/error/errorHandling';

export const apiKeycloakLogout = (): Promise<any> =>
	new Promise((resolve, reject) => {
		const url = endpoints.keycloakLogout;
		const refreshToken = getValueFromCookie('refreshToken');
		const data = `client_id=app&grant_type=refresh_token&refresh_token=${refreshToken}`;

		const req = new Request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'cache-control': 'no-cache'
			},
			credentials: 'include',
			body: data
		});

		fetch(req)
			.then((response) => {
				if (response.status === 204) {
					resolve(response);
				} else {
					const error = getErrorCaseForStatus(response.status);
					redirectToErrorPage(error);
					reject(new Error('keycloakLogout'));
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
