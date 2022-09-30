import { appConfig } from '../../utils/appConfig';

export const calcomLogout = () => {
	const calcomUrl = appConfig.calcomUrl;

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
