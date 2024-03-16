import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiGetIsUsernameAvailable = async (
	username: string
): Promise<any> => {
	return fetchData({
		url: `${endpoints.baseUserService}/${username}`,
		method: FETCH_METHODS.GET,
		headersData: {},
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	});
};
