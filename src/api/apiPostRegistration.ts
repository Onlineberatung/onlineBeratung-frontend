import { autoLogin } from '../components/registration/autoLogin';
import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from './fetchData';
import { COOKIE_KEY } from '../globalState';

export const apiPostRegistration = (url: string, data: {}): Promise<any> => {
	removeAllCookies([COOKIE_KEY]);

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(data),
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	}).then(() =>
		autoLogin({
			username: data['username'],
			password: decodeURIComponent(data['password']),
			redirect: false
		})
	);
};
