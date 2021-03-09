import { config } from '../resources/scripts/config';
import { FETCH_METHODS, fetchData, FETCH_ERRORS } from './fetchData';

// TODO: remove offset and count out of URL on api change
export const apiGetSessionData = async (rcGroupId: string): Promise<any> => {
	const url = config.endpoints.messages + `?rcGroupId=${rcGroupId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
