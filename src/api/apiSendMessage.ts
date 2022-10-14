import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiSendMessage = async (
	encryptedMessageData: string,
	unencryptedMessageData: string,
	rcGroupIdOrSessionId: string | number,
	isFeedback: boolean,
	sendMailNotification: boolean,
	isEncrypted: boolean
): Promise<any> => {
	const url = isFeedback
		? endpoints.sendMessageToFeedback
		: endpoints.sendMessage;
	const activeGroupId = isFeedback
		? { rcFeedbackGroupId: rcGroupIdOrSessionId }
		: { rcGroupId: rcGroupIdOrSessionId };
	const message = JSON.stringify({
		message: encryptedMessageData,
		org: unencryptedMessageData,
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
