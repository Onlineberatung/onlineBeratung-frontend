import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';
import { TopicsDataInterface } from '../globalState/interfaces/TopicsDataInterface';

export const apiGetTopicsData = async (): Promise<TopicsDataInterface[]> => {
	const url = config.endpoints.topicsData;

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

export const apiGetTopicById = async (
	topicId: any
): Promise<TopicsDataInterface> => {
	return apiGetTopicsData().then((response) =>
		response.find((topic) => topic.id == topicId)
	);
};
