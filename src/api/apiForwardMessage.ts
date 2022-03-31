import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiForwardMessage = async (
	messageData: string,
	messageDate: string,
	displayName: string,
	userId: string,
	rcGroupId: string
): Promise<any> => {
	const url = config.endpoints.forwardMessage;
	const headersData = { rcGroupId: rcGroupId };
	const data = JSON.stringify({
		message: messageData,
		timestamp: messageDate,
		username: displayName, // TODO change to displayName if message service is adjusted
		rcUserId: userId
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		headersData: headersData,
		rcValidation: true,
		bodyData: data
	});
};
