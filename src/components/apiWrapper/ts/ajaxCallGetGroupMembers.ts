import { config } from '../../../resources/ts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const getGroupMembers = async (chatId: string): Promise<any> => {
	const url = `${config.endpoints.groupChatBase + chatId}/members`;
	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
