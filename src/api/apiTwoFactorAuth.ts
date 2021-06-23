import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPutTwoFactorAuth = async (body: {
	secret: string;
	totp: string;
}): Promise<any> => {
	const url = config.endpoints.twoFactorAuth;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify(body),
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
