import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

export const apiSendEnquiry = async (
	sessionId: number,
	messageData: string,
	isEncrypted: boolean,
	language?: string
): Promise<any> => {
	const url = `${endpoints.sessionBase}/${sessionId}/enquiry/new`;
	const data: any = {
		message: messageData,
		t: isEncrypted ? 'e2e' : '',
		sendNotification: true
	};
	if (language) {
		data.language = language;
	}

	const message = JSON.stringify(data);

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		rcValidation: true,
		bodyData: message,
		responseHandling: [FETCH_SUCCESS.CONTENT]
	});
};
