import { endpoints } from '../../resources/scripts/endpoints';
import { LoginData } from '../registration/autoLogin';

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
		const url = endpoints.rc.accessToken;

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
