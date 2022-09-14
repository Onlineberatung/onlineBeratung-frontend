import { config } from '../../../resources/scripts/config';

export const calcomLogout = async () => {
	const csrfRequest = await fetch(
		`${config.urls.appointmentServiceDevServer}/api/auth/csrf`,
		{
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'GET',
			credentials: 'include'
		}
	)
		.then((response) => response.json())
		.then((data) => data);

	const logoutCalcom = await fetch(
		`${config.urls.appointmentServiceDevServer}/api/auth/signout`,
		{
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			body: `csrfToken=${csrfRequest.csrfToken}`,
			method: 'POST',
			credentials: 'include'
		}
	);

	return logoutCalcom;
};
