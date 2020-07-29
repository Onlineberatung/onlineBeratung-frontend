import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxSendMessage = async (
	messageData: string,
	rcGroupId: string,
	isFeedback: boolean,
	sendMailNotification: boolean
): Promise<any> => {
	const url = isFeedback
		? config.endpoints.sendMessageToFeedback
		: config.endpoints.sendMessage;
	const activeGroupId = isFeedback
		? { rcFeedbackGroupId: rcGroupId }
		: { rcGroupId: rcGroupId };
	const message = JSON.stringify({
		message: messageData.trim(),
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
