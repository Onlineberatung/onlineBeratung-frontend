import { config } from '../../../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const updatePassword = async (
	oldPassword,
	newPassword
): Promise<any> => {
	const url = config.endpoints.passwordReset;
	const passwords = JSON.stringify({
		oldPassword,
		newPassword
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: passwords,
		responseHandling: [FETCH_ERRORS.PASSWORD]
	});
};
