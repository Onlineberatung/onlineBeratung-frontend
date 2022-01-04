import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiGetMonitoring = async (sessionId: number) => {
	const url = `${config.endpoints.sessionBase}/${sessionId}/monitoring`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
