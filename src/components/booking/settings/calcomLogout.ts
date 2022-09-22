import { getAppSettings } from '../../../utils/settingsHelper';

export const calcomLogout = () => {
	const { calcomUrl } = getAppSettings();

	return fetch(`${calcomUrl}/api/auth/csrf`, {
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'GET',
		credentials: 'include'
	})
		.then((response) => response.json())
		.then(({ csrfToken }) =>
			fetch(`${calcomUrl}/api/auth/signout`, {
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				body: `csrfToken=${csrfToken}`,
				method: 'POST',
				credentials: 'include'
			})
		);
};
