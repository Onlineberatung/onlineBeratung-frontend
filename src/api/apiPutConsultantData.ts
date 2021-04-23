import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiPutConsultantData = async (
	email: string,
	firstname: string,
	lastname: string
): Promise<any> => {
	const url = config.endpoints.userData;
	const consultantData = JSON.stringify({
		email: email.trim(),
		firstname: firstname.trim(),
		lastname: lastname.trim()
	});

	return fetchData({
		bodyData: consultantData,
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT_WITH_RESPONSE]
	});
};
