import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetAskerSessionList = async (): Promise<any> => {
	const url = config.endpoints.askerSessions;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true
	});
};
