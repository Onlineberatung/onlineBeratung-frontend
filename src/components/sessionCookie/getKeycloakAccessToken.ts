import { FetchErrorWithOptions, FETCH_ERRORS } from '../../api';
import { endpoints } from '../../resources/scripts/endpoints';
import { LoginData } from '../registration/autoLogin';

export const getKeycloakAccessToken = (
	username: string,
	password: string,
	otp?: string
): Promise<LoginData> =>
	new Promise((resolve, reject) => {
		const data = `username=${username}&password=${password}${
			otp ? `&otp=${otp}` : ``
		}&client_id=app&grant_type=password`;
		const url = endpoints.keycloakAccessToken;

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
				} else if (response.status === 400) {
					response.json().then((data) => {
						reject(
							new FetchErrorWithOptions(
								FETCH_ERRORS.BAD_REQUEST,
								{
									data
								}
							)
						);
					});
				} else if (response.status === 401) {
					reject(new Error(FETCH_ERRORS.UNAUTHORIZED));
				}
			})
			.catch((error) => {
				reject(new Error('keycloakLogin'));
			});
	});
