import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiSendMessage = async (
	messageData: string,
	rcGroupIdOrSessionId: string | number,
	isFeedback: boolean,
	sendMailNotification: boolean
): Promise<any> => {
	const url = isFeedback
		? config.endpoints.sendMessageToFeedback
		: config.endpoints.sendMessage;
	const activeGroupId = isFeedback
		? { rcFeedbackGroupId: rcGroupIdOrSessionId }
		: { rcGroupId: rcGroupIdOrSessionId };
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
