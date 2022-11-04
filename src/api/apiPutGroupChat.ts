import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const GROUP_CHAT_API = {
	CREATE: 'new',
	CREATEV2: 'v2/new',
	JOIN: '/join',
	LEAVE: '/leave',
	START: '/start',
	STOP: '/stop',
	UPDATE: '/update',
	ASSIGN: '/assign'
};

export const apiPutGroupChat = async (
	groupChatId: number | string,
	groupChatApi: string
): Promise<any> => {
	const url = endpoints.groupChatBase + groupChatId + groupChatApi;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT, FETCH_ERRORS.CATCH_ALL]
	});
};
