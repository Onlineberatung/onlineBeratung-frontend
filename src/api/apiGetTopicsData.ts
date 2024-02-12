import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';
import { TopicsDataInterface } from '../globalState/interfaces';

export const apiGetTopicsData = async (): Promise<TopicsDataInterface[]> => {
	const url = endpoints.topicsData;

	return fetchData({
		url: url,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY],
		method: FETCH_METHODS.GET
	}).catch((error) => {
		if (error.message === FETCH_ERRORS.EMPTY) {
			return [];
		}
		Promise.reject(error);
	});
};
