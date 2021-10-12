import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiPutArchive = async (sessionId: number): Promise<any> => {
	const url = `${config.endpoints.sessionBase}/${sessionId}/archive`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT
	});
};
