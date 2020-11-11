import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxCallPostDraftMessage = async (
	rcGroupId: string,
	messageData: string
): Promise<any> => {
	const url = config.endpoints.draftMessages;
	const message = JSON.stringify({
		message: messageData
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		headersData: { rcGroupId: rcGroupId },
		bodyData: message
	});
};
