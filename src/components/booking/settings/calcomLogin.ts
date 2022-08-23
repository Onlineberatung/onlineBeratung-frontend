import { UserDataInterface } from '../../../globalState';
import { config } from '../../../resources/scripts/config';

export default (userData: UserDataInterface) => {
	return fetch(config.endpoints.counselorToken(userData.userId))
		.then((resp) => resp.json())
		.then((tokenResponse) => {
			fetch(`${config.urls.appointmentServiceDevServer}/api/auth/csrf`, {
				credentials: 'include'
			})
				.then((resp) => resp.json())
				.then((data) => {
					fetch(
						`${config.urls.appointmentServiceDevServer}/api/auth/callback/credentials?`,
						{
							headers: {
								'content-type':
									'application/x-www-form-urlencoded'
							},
							body: `csrfToken=${data.csrfToken}&email=${userData.email}&password=${tokenResponse.token}&callbackUrl=${config.urls.appointmentServiceDevServer}%2F&redirect=false&json=true`,
							method: 'POST',
							credentials: 'include'
						}
					);
				});
		});
};
