import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiUpdateUserE2EKeys = async (publicKey): Promise<any> => {
	const url = endpoints.userUpdateE2EKey;

	const data = JSON.stringify({
		publicKey
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		rcValidation: true,
		bodyData: data,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
};
