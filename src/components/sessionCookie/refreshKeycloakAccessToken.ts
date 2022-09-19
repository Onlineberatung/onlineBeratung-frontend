import { endpoints } from '../../resources/scripts/endpoints';
import { LoginData } from '../registration/autoLogin';
import { getValueFromCookie } from './accessSessionCookie';

export const refreshKeycloakAccessToken = (): Promise<LoginData> =>
	new Promise((resolve, reject) => {
		const refreshToken = getValueFromCookie('refreshToken');
		const data =
			'refresh_token=' +
			refreshToken +
			'&client_id=app&grant_type=refresh_token';
		const url = endpoints.keycloakAccessToken;

		const req = new Request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'cache-control': 'no-cache'
			},
			body: data
		});

		fetch(req)
			.then((response) => {
				if (response.status === 200) {
					const data = response.json();
					resolve(data);
				} else if (response.status === 401) {
					reject(new Error('keycloakLogin'));
				}
			})
			.catch((error) => {
				reject(new Error('keycloakLogin'));
			});
	});
