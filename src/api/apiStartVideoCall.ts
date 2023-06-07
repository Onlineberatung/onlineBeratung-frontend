import { endpoints } from '../resources/scripts/endpoints';
import {
	fetchData,
	FETCH_METHODS,
	FETCH_SUCCESS,
	FETCH_ERRORS
} from './fetchData';

export const apiStartVideoCall = async (
	sessionId: number,
	initiatorDisplayName: string,
	groupId?: number
): Promise<{ moderatorVideoCallUrl: string }> => {
	const url = endpoints.startVideoCall;
	const videoCallData = JSON.stringify({
		sessionId: sessionId,
		groupChatId: groupId,
		initiatorDisplayName: initiatorDisplayName
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: videoCallData,
		responseHandling: [FETCH_SUCCESS.CONTENT, FETCH_ERRORS.CATCH_ALL],
		rcValidation: true
	});
};
