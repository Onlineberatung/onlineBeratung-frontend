import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPatchUserData = async (data): Promise<any> => {
	const url = config.endpoints.userData;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PATCH,
		bodyData: JSON.stringify({ ...data }),
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
