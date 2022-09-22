import { getAppSettings } from '../../utils/settingsHelper';

export const budibaseLogout = () => {
	const { budibaseUrl } = getAppSettings();

	return fetch(`${budibaseUrl}/api/global/auth/logout`, {
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'POST',
		credentials: 'include'
	});
};
