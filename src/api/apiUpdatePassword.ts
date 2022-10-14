import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiUpdatePassword = async (
	oldPassword,
	newPassword
): Promise<any> => {
	const url = endpoints.passwordReset;
	const passwords = JSON.stringify({
		oldPassword,
		newPassword
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: passwords,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
