import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiFinishAnonymousConversation = async (
	sessionId: number
): Promise<any> => {
	const url = `${endpoints.anonymousBase}${sessionId}/finish`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT, FETCH_ERRORS.ABORTED]
	});
};
