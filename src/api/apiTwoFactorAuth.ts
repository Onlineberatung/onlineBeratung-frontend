import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPutTwoFactorAuthApp = async (body: {
	secret: string;
	otp: string;
}): Promise<any> => {
	const url = endpoints.twoFactorAuthApp;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify(body),
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiPutTwoFactorAuthEmail = async (email: string): Promise<any> => {
	const url = endpoints.twoFactorAuthEmail;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify({ email }),
		responseHandling: [
			FETCH_ERRORS.BAD_REQUEST,
			FETCH_ERRORS.PRECONDITION_FAILED
		]
	});
};

export const apiPatchTwoFactorAuthEncourage = async (
	isToEncourage: boolean
): Promise<any> => {
	const url = endpoints.userData;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PATCH,
		bodyData: JSON.stringify({ encourage2fa: isToEncourage }),
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiPostTwoFactorAuthEmailWithCode = async (
	code: string
): Promise<any> => {
	const url = endpoints.twoFactorAuthEmail + '/validate/' + code;

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};

export const apiDeleteTwoFactorAuth = async (): Promise<any> => {
	const url = endpoints.twoFactorAuth;

	return fetchData({
		url: url,
		method: FETCH_METHODS.DELETE
	});
};
