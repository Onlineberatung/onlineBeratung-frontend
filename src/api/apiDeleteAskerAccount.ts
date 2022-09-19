import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiDeleteAskerAccount = async (
	passwordData: string
): Promise<void> => {
	const url = endpoints.deleteAskerAccount;
	const password = JSON.stringify({
		password: passwordData
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE,
		bodyData: password,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
