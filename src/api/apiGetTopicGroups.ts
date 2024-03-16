import { TopicGroup } from '../globalState/interfaces/TopicGroups';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiGetTopicGroups = async (): Promise<{
	data: { items: Array<TopicGroup> };
}> => {
	return fetchData({
		url: endpoints.topicGroups,
		responseHandling: [FETCH_ERRORS.EMPTY],
		method: FETCH_METHODS.GET
	});
};
