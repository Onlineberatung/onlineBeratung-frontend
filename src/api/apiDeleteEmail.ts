import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiDeleteEmail = async (): Promise<any> => {
	return fetchData({
		url: endpoints.email,
		method: FETCH_METHODS.DELETE
	});
};
