import { appConfig } from '../../utils/appConfig';

export const budibaseLogout = () => {
	const budibaseUrl = appConfig.budibaseUrl;

	return fetch(
		`${window.location.origin}/auth/realms/online-beratung/protocol/openid-connect/logout`
	).then(() =>
		fetch(`${budibaseUrl}/api/global/auth/logout`, {
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			credentials: 'include'
		}).catch(console.error)
	);
};
