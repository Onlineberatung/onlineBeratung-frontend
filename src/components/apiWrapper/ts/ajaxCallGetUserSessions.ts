import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const ajaxCallGetUserSessions = async (): Promise<any> => {
	const url = config.endpoints.userSessions;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
