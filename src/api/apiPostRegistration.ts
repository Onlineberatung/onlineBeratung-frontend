import { autoLogin } from '../components/registration/autoLogin';
import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from './fetchData';

export const apiPostRegistration = (
	url: string,
	data: { agencyId?: string }
): Promise<any> => {
	removeAllCookies(['useInformal']);

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(data),
		skipAuth: true,
		...(config.useMultiTenancyWithSingleDomain && {
			headersData: { agencyId: data.agencyId }
		}),
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	}).then(() =>
		autoLogin({
			username: data['username'],
			password: decodeURIComponent(data['password']),
			redirect: false
		})
	);
};
