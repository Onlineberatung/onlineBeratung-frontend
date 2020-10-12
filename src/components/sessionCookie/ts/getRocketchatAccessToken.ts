import { config } from '../../../resources/ts/config';
import { LoginData } from '../../registrationFormular/ts/autoLogin';

export const getRocketchatAccessToken = (
	username: string,
	password: string
): Promise<LoginData> =>
	new Promise((resolve, reject) => {
		const data = JSON.stringify({
			ldap: true,
			username: username,
			ldapPass: password,
			ldapOptions: {}
		});
		const url = config.endpoints.rocketchatAccessToken;

		const req = new Request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
					reject(new Error('rocketchatLogin'));
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
