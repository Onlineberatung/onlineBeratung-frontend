import { config } from '../../resources/scripts/config';
import { LoginData } from '../registration/autoLogin';

export const getKeycloakAccessToken = (
	username: string,
	password: string
): Promise<LoginData> =>
	new Promise((resolve, reject) => {
		const data =
			'username=' +
			username +
			'&password=' +
			password +
			'&client_id=app&grant_type=password';
		const url = config.endpoints.keycloakAccessToken;

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
				if (response.status === 200) {
					const data = response.json();
					resolve(data);
				} else if (response.status === 400 || response.status === 401) {
					reject(new Error('keycloakLogin'));
				}
			})
			.catch((error) => {
				reject(new Error('keycloakLogin'));
			});
	});
