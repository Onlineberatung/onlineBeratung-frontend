import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiEnquiryAcceptance = async (
	sessionId: number,
	isAnonymousEnquiry: boolean = false
): Promise<any> => {
	const url = isAnonymousEnquiry
		? `${config.endpoints.anonymousAskerBase}${sessionId}/accept`
		: `${config.endpoints.sessionBase}/new/${sessionId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.CONFLICT]
	});
};
