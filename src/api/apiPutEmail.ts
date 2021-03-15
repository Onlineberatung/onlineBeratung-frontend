import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiPutEmail = async (email: string): Promise<any> => {
	const url = config.endpoints.email;

	return fetchData({
		bodyData: email.trim(),
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT_WITH_RESPONSE]
	});
};
