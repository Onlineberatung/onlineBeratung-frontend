import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiDeleteUserFromRoom = async (
	sessionId: number,
	consultantId: string
) => {
	const url = `${config.endpoints.sessionBase}/${sessionId}/consultant/${consultantId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE,
		responseHandling: [FETCH_ERRORS.CONFLICT]
	});
};
