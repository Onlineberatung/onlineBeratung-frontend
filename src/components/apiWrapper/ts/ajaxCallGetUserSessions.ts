import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const ajaxCallGetUserSessions = async (): Promise<any> => {
	const url = config.endpoints.userSessions;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true
	});
};
