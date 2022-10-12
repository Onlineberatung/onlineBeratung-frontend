import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiPutArchive = async (sessionId: number): Promise<any> => {
	const url = `${endpoints.sessionBase}/${sessionId}/archive`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT
	});
};
