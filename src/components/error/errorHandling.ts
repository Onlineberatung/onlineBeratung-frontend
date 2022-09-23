import { logout } from '../logout/logout';
import { appConfig } from '../../utils/appConfig';

export const ERROR_TYPES = {
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	SERVER: 500
};

export const getErrorCaseForStatus = (status: number) => {
	if (status === 401 || status === 403) {
		return ERROR_TYPES.UNAUTHORIZED;
	} else if (status === 400 || status === 409 || status === 500) {
		return ERROR_TYPES.SERVER;
	} else {
		return ERROR_TYPES.NOT_FOUND;
	}
};

export const redirectToErrorPage = (error: number) => {
	let redirect;
	switch (error) {
		case ERROR_TYPES.UNAUTHORIZED:
			redirect = appConfig.urls.error401;
			break;
		case ERROR_TYPES.SERVER:
			redirect = appConfig.urls.error500;
			break;
		case ERROR_TYPES.NOT_FOUND:
			redirect = appConfig.urls.error404;
			break;
	}
	logout(true, redirect);
};
