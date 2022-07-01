import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiFinishAnonymousConversation = async (
	sessionId: number
): Promise<any> => {
	const url = `${config.endpoints.anonymousBase}${sessionId}/finish`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT, FETCH_ERRORS.ABORTED]
	});
};
