import { endpoints } from '../resources/scripts/endpoints';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiGetGroupMembers = async (chatId: number): Promise<any> => {
	const url = `${endpoints.groupChatBase + chatId}/members`;
	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
