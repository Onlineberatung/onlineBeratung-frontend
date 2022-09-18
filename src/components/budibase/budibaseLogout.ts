import { config } from '../../resources/scripts/config';

export const budibaseLogout = () => {
	return fetch(`${config.urls.budibaseDevServer}/api/global/auth/logout`, {
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'POST',
		credentials: 'include'
	});
};
