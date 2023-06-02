import { v4 as uuidv4 } from 'uuid';
import { logout } from '../logout/logout';
import { appConfig } from '../../utils/appConfig';
import { apiPostError, ERROR_LEVEL_ERROR } from '../../api/apiPostError';
import { requestCollector } from '../../utils/requestCollector';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';

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
	const correlationId = uuidv4();
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

	if (redirect) {
		const token = getValueFromCookie('keycloak');
		let isConsultant;
		if (token) {
			try {
				isConsultant = JSON.parse(
					atob(token.split('.')?.[1])
				)?.realm_access?.roles?.includes('consultant');
			} catch (e) {
				isConsultant = false;
			}
		}

		if (
			(isConsultant === true &&
				appConfig?.requestCollector?.showCorrelationId?.consultant) ||
			(isConsultant === false &&
				appConfig?.requestCollector?.showCorrelationId?.user) ||
			(isConsultant === undefined &&
				appConfig?.requestCollector?.showCorrelationId?.other)
		) {
			redirect += `?correlationId=${correlationId}`;
		}
	}

	void apiPostError(
		{
			name: `Error page redirect ${error}`,
			message: `User was redirected to error page ${redirect} because of a ${error} response code`,
			level: ERROR_LEVEL_ERROR,
			parsedStack: JSON.stringify(requestCollector.get())
		},
		null,
		correlationId
	);
	void logout(true, redirect);
};
