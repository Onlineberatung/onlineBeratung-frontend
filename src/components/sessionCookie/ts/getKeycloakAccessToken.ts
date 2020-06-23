import { config } from '../../../resources/ts/config';
import { LoginData } from '../../loginFormular/ts/handleLogin';

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
				} else if (response.status === 401) {
					reject(new Error('keycloakLogin'));
				}
			})
			.catch((error) => {
				reject(new Error('keycloakLogin'));
			});
	});
