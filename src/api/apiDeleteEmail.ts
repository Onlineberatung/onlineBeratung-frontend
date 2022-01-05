import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiDeleteEmail = async (): Promise<any> => {
	return fetchData({
		url: config.endpoints.email,
		method: FETCH_METHODS.DELETE
	});
};
