import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxCallEnquiryAcceptance = async (
	sessionId: number
): Promise<any> => {
	const url = config.endpoints.enquiryAcceptance + '/' + sessionId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		rcValidation: true
	});
};
