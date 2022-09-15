import { config } from '../../../resources/scripts/config';

export const calcomLogout = () => {
	return fetch(`${config.urls.appointmentServiceDevServer}/api/auth/csrf`, {
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		method: 'GET',
		credentials: 'include'
	})
		.then((response) => response.json())
		.then(({ csrfToken }) =>
			fetch(
				`${config.urls.appointmentServiceDevServer}/api/auth/signout`,
				{
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					body: `csrfToken=${csrfToken}`,
					method: 'POST',
					credentials: 'include'
				}
			)
		);
};
