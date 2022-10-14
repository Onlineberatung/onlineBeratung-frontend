import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiDeleteRemove = async (sessionId: number): Promise<any> => {
	const url = `${endpoints.sessionBase}/${sessionId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE
	});
};
