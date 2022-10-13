import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetAskerSessionList = async (): Promise<any> => {
	const url = endpoints.askerSessions;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true
	});
};
