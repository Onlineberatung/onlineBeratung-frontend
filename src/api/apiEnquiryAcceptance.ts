import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiEnquiryAcceptance = async (sessionId: number): Promise<any> => {
	const url = config.endpoints.enquiryAcceptance + '/' + sessionId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		rcValidation: true
	});
};
