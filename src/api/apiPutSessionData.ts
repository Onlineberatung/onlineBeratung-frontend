import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiPutSessionData = async (
	sessionId: number,
	voluntaryData: any
): Promise<any> => {
	const url = config.endpoints.sessionBase + '/' + sessionId + '/data';
	const sessionData = JSON.stringify(voluntaryData);

	return fetchData({
		bodyData: sessionData,
		url: url,
		method: FETCH_METHODS.PUT
	});
};
