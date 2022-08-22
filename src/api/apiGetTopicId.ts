import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { TopicsDataInterface } from '../globalState/interfaces/TopicsDataInterface';

export const apiGetTopicById = async (
	topicId: any
): Promise<TopicsDataInterface> => {
	const url = config.endpoints.topicsData;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	}).then((response) => response.find((topic) => topic.id == topicId));
};
