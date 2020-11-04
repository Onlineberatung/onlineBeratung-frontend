import { config } from '../../../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxSendEnquiry = async (
	sessionId: number,
	messageData: string
): Promise<any> => {
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
