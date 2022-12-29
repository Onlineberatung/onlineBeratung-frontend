import { endpoints } from '../resources/scripts/endpoints';
import { FETCH_METHODS, fetchData, FETCH_ERRORS } from './fetchData';

export const apiGetMessages = async (
	rcGroupId: string,
	signal?: AbortSignal,
	offset?: number,
	count?: number,
	since?: string
): Promise<any> => {
	let url = endpoints.messages.get + `?rcGroupId=${rcGroupId}`;

	if (offset >= 0) {
		url += `&offset=${offset}`;
	}
	if (count >= 0) {
		url += `&count=${count}`;
	}
	if (since) {
		url += `&since=${since}`;
	}

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.CATCH_ALL],
		...(signal && { signal: signal })
	});
};
