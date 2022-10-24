import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPatchUserData = async (data): Promise<any> => {
	const url = endpoints.userData;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PATCH,
		bodyData: JSON.stringify({ ...data }),
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
