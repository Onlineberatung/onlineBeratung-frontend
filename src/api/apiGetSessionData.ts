import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData, FETCH_ERRORS } from './fetchData';

// TODO: remove offset and count out of URL on api change
export const apiGetSessionData = async (
	rcGroupId: string,
	offset: number = 0,
	count: number = 0
): Promise<any> => {
	const url =
		config.endpoints.messages +
		`?offset=${offset}&count=${count}&rcGroupId=${rcGroupId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
