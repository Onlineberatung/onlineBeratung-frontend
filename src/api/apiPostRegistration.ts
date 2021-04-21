import { generateCsrfToken } from '../utils/generateCsrfToken';
import { autoLogin } from '../components/registration/autoLogin';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../components/error/errorHandling';
import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';

let isRequestInProgress = false;
export const apiPostRegistration = (
	url: string,
	data: {},
	handleSuccessfulRegistration: Function,
	handleRegistrationConflictError: Function
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
			autoLogin({
				username: data['username'],
				password: decodeURIComponent(data['password']),
				redirect: false,
				handleLoginSuccess: handleSuccessfulRegistration
			});
		} else if (xhr.readyState > 3 && xhr.status === 409) {
			handleRegistrationConflictError(xhr);
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
