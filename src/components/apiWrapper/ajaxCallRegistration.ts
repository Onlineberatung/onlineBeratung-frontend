import {
	removeWarningLabels,
	warningLabelForTranslatableAndParentId
} from '../registration/warningLabels';
import { generateCsrfToken } from '../../resources/scripts/helpers/generateCsrfToken';
import { autoLogin } from '../registration/autoLogin';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../error/errorHandling';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';

let isRequestInProgress = false;
export const postRegistration = (
	url: string,
	data: {},
	handleSuccessfulRegistration: Function
) => {
	removeAllCookies();
	if (isRequestInProgress) {
		return null;
	}
	isRequestInProgress = true;
	const xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.onreadystatechange = function () {
		if (xhr.readyState > 3 && xhr.status === 201) {
			autoLogin(
				data['username'],
				decodeURIComponent(data['password']),
				false
			);
			handleSuccessfulRegistration();
		} else if (xhr.readyState > 3 && xhr.status === 409) {
			handleConfirmationError(xhr.response);
			isRequestInProgress = false;
		} else if (
			xhr.readyState > 3 &&
			xhr.status !== 201 &&
			xhr.status !== 409
		) {
			const error = getErrorCaseForStatus(xhr.status);
			redirectToErrorPage(error);
		}
	};
	const csrfToken = generateCsrfToken();

	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
	xhr.withCredentials = true;
	xhr.send(JSON.stringify(data));
	return xhr;
};

export const handleConfirmationError = (data: string) => {
	removeWarningLabels();
	window.scrollTo(0, 0);
	if (data.includes('"usernameAvailable":0')) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.username.unavailable',
			'username'
		);
	}
	if (data.includes('"emailAvailable":0')) {
		warningLabelForTranslatableAndParentId(
			'warningLabels.email.unavailable',
			'email'
		);
	}
};
