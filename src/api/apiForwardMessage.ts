import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiForwardMessage = async (
	messageData: string,
	messageDate: string,
	displayName: string,
	userId: string,
	rcGroupId: string,
	isEncrypted: boolean
): Promise<any> => {
	const url = endpoints.forwardMessage;
	const headersData = { rcGroupId: rcGroupId };
	const data = JSON.stringify({
		message: messageData,
		timestamp: messageDate,
		username: displayName, // TODO change to displayName if message service is adjusted
		rcUserId: userId,
		t: isEncrypted ? 'e2e' : ''
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		headersData: headersData,
		rcValidation: true,
		bodyData: data
	});
};
