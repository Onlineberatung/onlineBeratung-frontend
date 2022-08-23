import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiUpdateUserE2EKeys = async (publicKey): Promise<any> => {
	const url = config.endpoints.userUpdateE2EKey;

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
