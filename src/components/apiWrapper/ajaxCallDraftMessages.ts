import { config } from '../../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const ajaxCallPostDraftMessage = async (
	rcGroupId: string,
	messageData: string
): Promise<void> => {
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

interface draftMessage {
	message: string;
}

export const ajaxCallGetDraftMessage = async (
	rcGroupId: string
): Promise<draftMessage> => {
	const url = config.endpoints.draftMessages;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		headersData: { rcGroupId: rcGroupId },
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
