import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';
import { TopicsDataInterface } from '../globalState/interfaces/TopicsDataInterface';

export const apiGetTopicsData = async (): Promise<TopicsDataInterface[]> => {
	const url = config.endpoints.topicsData;

	return fetchData({
		url: url,
		rcValidation: true,
		method: FETCH_METHODS.GET
	});
};
