import { TopicsDataInterface } from '../globalState/interfaces/TopicsDataInterface';
import { apiGetTopicsData } from './apiGetTopicsData';

export const apiGetTopicById = async (
	topicId: string
): Promise<TopicsDataInterface> => {
	return apiGetTopicsData().then((response) =>
		response.find((topic) => topic.id.toString() === topicId)
	);
};
