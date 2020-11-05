import { config } from '../../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxForwardMessage = async (
	messageData: string,
	messageDate: string,
	username: string,
	userId: string,
	rcGroupId: string
): Promise<any> => {
	const url = config.endpoints.forwardMessage;
	const headersData = { rcGroupId: rcGroupId };
	const data = JSON.stringify({
		message: messageData,
		timestamp: messageDate,
		username: username,
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
