import { UserDataInterface } from '../../../globalState';
import { config } from '../../../resources/scripts/config';
import { FETCH_METHODS, fetchData } from '../../../api';

export const calcomLogin = async (userData: UserDataInterface) => {
	const csrfRequest = await fetchData({
		url: `${config.urls.appointmentServiceDevServer}/api/auth/csrf`,
		method: FETCH_METHODS.GET
	});

	const tokenResponse = await fetchData({
		url: config.endpoints.counselorToken,
		method: FETCH_METHODS.GET
	});

	const loginCalcom = await fetch(
		`${config.urls.appointmentServiceDevServer}/api/auth/callback/credentials?`,
		{
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			body: `csrfToken=${csrfRequest.csrfToken}&email=${userData.email}&password=${tokenResponse.token}&callbackUrl=${config.urls.appointmentServiceDevServer}%2F&redirect=false&json=true`,
			method: 'POST',
			credentials: 'include'
		}
	);

	return loginCalcom;
};
