import { autoLogin } from '../components/registration/autoLogin';
import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { TenantDataInterface } from '../globalState/interfaces';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from './fetchData';
import { COOKIE_KEY } from '../globalState';

export const apiPostRegistration = (
	url: string,
	data: { agencyId?: string },
	useMultiTenancyWithSingleDomain: boolean,
	tenant: TenantDataInterface
): Promise<any> => {
	removeAllCookies([COOKIE_KEY]);

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(data),
		skipAuth: true,
		...(useMultiTenancyWithSingleDomain && {
			headersData: { agencyId: data.agencyId }
		}),
		responseHandling: [FETCH_ERRORS.CATCH_ALL_WITH_RESPONSE]
	}).then(() =>
		autoLogin({
			username: data['username'],
			password: decodeURIComponent(data['password']),
			tenantData: tenant
		})
	);
};
