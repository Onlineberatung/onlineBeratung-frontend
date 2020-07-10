import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxSendEnquiry = async (
	sessionId: number,
	messageData: string
): Promise<any> => {
	if (!messageData.trim()) {
		return 'emptyMessage';
	}
	const url = config.endpoints.enquiryBase + sessionId + '/enquiry/new';
	const message = JSON.stringify({
		message: messageData,
		sendNotification: true
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		rcValidation: true,
		bodyData: message
	});
};
