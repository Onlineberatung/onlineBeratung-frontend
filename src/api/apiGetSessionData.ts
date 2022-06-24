import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData, FETCH_ERRORS } from './fetchData';

export const apiGetSessionData = async (
	rcGroupId: string,
	signal?: AbortSignal
): Promise<any> => {
	const url = config.endpoints.messages + `?rcGroupId=${rcGroupId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY],
		...(signal && { signal: signal })
	});
};
