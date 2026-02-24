import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiSendMessage = (
	messageData: string,
	rcGroupIdOrSessionId: string | number,
	sendMailNotification: boolean,
	isEncrypted: boolean
): Promise<any> => {
	const url = endpoints.sendMessage;
	const activeGroupId = { rcGroupId: rcGroupIdOrSessionId };
	const message = JSON.stringify({
		message: messageData,
		t: isEncrypted ? 'e2e' : '',
		sendNotification: sendMailNotification
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		headersData: activeGroupId,
		rcValidation: true,
		bodyData: message
	});
};
