import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiPostAnonymousRegistration = async (
	consultingType: number
): Promise<void> => {
	const url = config.endpoints.registerAnonymousAsker;
	const data = JSON.stringify({
		consultingType: consultingType
	});

	removeAllCookies();

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: data,
		skipAuth: true
	});
};
