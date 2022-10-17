import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPostDraftMessage = async (
	rcGroupIdOrSessionId: string | number,
	messageData: string,
	encryptType: string,
	org: string
): Promise<void> => {
	const url = config.endpoints.draftMessages;
	const message = JSON.stringify({
		message: messageData,
		t: encryptType,
		org
	});
	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		headersData: { rcGroupId: rcGroupIdOrSessionId },
		bodyData: message
	});
};

export interface IDraftMessage {
	message: string;
	t: string;
	org: string;
}

export const apiGetDraftMessage = async (
	rcGroupIdOrSessionId: string | number,
	signal?: AbortSignal
): Promise<IDraftMessage> => {
	const url = config.endpoints.draftMessages;
	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		headersData: { rcGroupId: rcGroupIdOrSessionId },
		responseHandling: [FETCH_ERRORS.EMPTY],
		...(signal && { signal: signal })
	});
};
