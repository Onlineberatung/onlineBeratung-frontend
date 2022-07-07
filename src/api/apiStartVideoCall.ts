import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

export const apiStartVideoCall = async (
	sessionId: number,
	initiatorDisplayName: string
): Promise<{ moderatorVideoCallUrl: string }> => {
	const url = config.endpoints.startVideoCall;
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
