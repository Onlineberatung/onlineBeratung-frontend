import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetUserDataBySessionId = async (
	sessionId: number
): Promise<any> => {
	return fetchData({
		url: config.endpoints.userDataBySessionId(sessionId),
		rcValidation: true,
		method: FETCH_METHODS.GET
	});
};
