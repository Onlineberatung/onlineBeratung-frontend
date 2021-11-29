import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

export const apiSendEnquiry = async (
	sessionId: number,
	messageData: string
): Promise<any> => {
	const url = `${config.endpoints.sessionBase}/${sessionId}/enquiry/new`;
	const message = JSON.stringify({
		message: messageData,
		sendNotification: true
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		rcValidation: true,
		bodyData: message,
		responseHandling: [FETCH_SUCCESS.CONTENT]
	});
};
