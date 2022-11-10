import { endpoints } from '../resources/scripts/endpoints';
import { FETCH_METHODS, fetchData, FETCH_ERRORS } from './fetchData';

export const apiGetSessionData = async (
	rcGroupId: string,
	signal?: AbortSignal
): Promise<any> => {
	const url = endpoints.messages.get + `?rcGroupId=${rcGroupId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.CATCH_ALL],
		...(signal && { signal: signal })
	});
};
