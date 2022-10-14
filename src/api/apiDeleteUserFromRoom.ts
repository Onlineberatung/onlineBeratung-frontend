import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiDeleteUserFromRoom = async (
	sessionId: number,
	consultantId: string
) => {
	const url = `${endpoints.sessionBase}/${sessionId}/consultant/${consultantId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE,
		responseHandling: [FETCH_ERRORS.CONFLICT]
	});
};
