import { endpoints } from '../resources/scripts/endpoints';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';

export const apiKeycloakLogout = async (): Promise<any> => {
	const url = endpoints.keycloakLogout;
	const refreshToken = getValueFromCookie('refreshToken');
	const data = `client_id=app&grant_type=refresh_token&refresh_token=${refreshToken}`;

	return fetch(
		new Request(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'cache-control': 'no-cache'
			},
			credentials: 'include',
			body: data
		})
	);
};
