import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';

export interface AnonymousRegistrationResponse {
	userName: string;
	sessionId: number;
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
	rcUserId: string;
	rcToken: string;
	rcGroupId: string;
	refreshExpiresIn: number;
}

export const apiPostAnonymousRegistration = async (
	consultingType: number
): Promise<AnonymousRegistrationResponse> => {
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
