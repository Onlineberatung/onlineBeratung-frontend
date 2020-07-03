import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxSendEnquiry = async (messageData: string): Promise<any> => {
	const url = config.endpoints.enquiry;
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
