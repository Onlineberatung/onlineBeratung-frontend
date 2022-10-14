import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

export const apiStartVideoCall = async (
	sessionId: number,
	initiatorDisplayName: string
): Promise<{ moderatorVideoCallUrl: string }> => {
	const url = endpoints.startVideoCall;
	const videoCallData = JSON.stringify({
		sessionId: sessionId,
		initiatorDisplayName: initiatorDisplayName
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: videoCallData,
		responseHandling: [FETCH_SUCCESS.CONTENT],
		rcValidation: true
	});
};
