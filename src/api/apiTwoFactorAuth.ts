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

export const apiGetTwoFactorAuthEmail = async (mail: string): Promise<any> => {
	const url = config.endpoints.twoFactorAuthEmail + '?email=' + mail;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiGetTwoFactorAuthEmailWithCode = async (
	code: string
): Promise<any> => {
	const url = config.endpoints.twoFactorAuthEmail + '/' + code;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
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
