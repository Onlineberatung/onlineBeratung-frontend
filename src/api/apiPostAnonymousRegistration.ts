import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

interface anonymousRegistrationResponse {
	userName: string;
	sessionId: number;
	accessToken: string;
	refreshToken: string;
	rcUserId: string;
	rcToken: string;
	rcGroupId: string;
}

export const apiPostAnonymousRegistration = async (
	consultingType: number
): Promise<anonymousRegistrationResponse> => {
	const url = config.endpoints.registerAnonymousAsker;
	const data = JSON.stringify({
		consultingType: consultingType
	});

	removeAllCookies();

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: data,
		skipAuth: true,
		responseHandling: [FETCH_SUCCESS.CONTENT]
	});
};
