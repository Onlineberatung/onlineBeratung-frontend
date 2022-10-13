import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiPutDearchive = async (sessionId: number): Promise<any> => {
	const url = `${endpoints.sessionBase}/${sessionId}/dearchive`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT
	});
};
