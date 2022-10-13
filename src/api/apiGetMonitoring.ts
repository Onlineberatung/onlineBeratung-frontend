import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiGetMonitoring = async (sessionId: number) => {
	const url = `${endpoints.sessionBase}/${sessionId}/monitoring`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
