import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData } from './fetchData';

export const apiGetGroupMembers = async (chatId: number): Promise<any> => {
	const url = `${config.endpoints.groupChatBase + chatId}/members`;
	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
