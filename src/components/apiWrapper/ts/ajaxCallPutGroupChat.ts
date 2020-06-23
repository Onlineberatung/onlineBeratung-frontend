import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const GROUP_CHAT_API = {
	CREATE: 'new',
	JOIN: '/join',
	LEAVE: '/leave',
	START: '/start',
	STOP: '/stop',
	UPDATE: '/update'
};

export const ajaxCallPutGroupChat = async (
	groupChatId: number,
	groupChatApi: string
): Promise<any> => {
	const url = config.endpoints.groupChatBase + groupChatId + groupChatApi;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT]
	});
};
