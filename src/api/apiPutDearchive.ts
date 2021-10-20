import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiPutDearchive = async (sessionId: number): Promise<any> => {
	const url = `${config.endpoints.sessionBase}/${sessionId}/dearchive`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT
	});
};
