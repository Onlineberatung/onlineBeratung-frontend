import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPutTwoFactorAuthApp = async (body: {
	secret: string;
	initialCode: string;
}): Promise<any> => {
	const url = config.endpoints.twoFactorAuthApp;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify(body),
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiPutTwoFactorAuthEmail = async (email: string): Promise<any> => {
	const url = config.endpoints.twoFactorAuthEmail;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify({ email }),
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiPutTwoFactorAuthHint = async (
	isShown: boolean
): Promise<any> => {
	const url = config.endpoints.twoFactorAuthHint;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify({ hint2fa: isShown }),
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiPostTwoFactorAuthEmailWithCode = async (
	code: string
): Promise<any> => {
	const url = config.endpoints.twoFactorAuthEmail + '/validate/' + code;

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiDeleteTwoFactorAuth = async (): Promise<any> => {
	const url = config.endpoints.twoFactorAuth;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE
	});
};
