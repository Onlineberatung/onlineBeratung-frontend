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
	handleRegistrationConflictError: Function
): Promise<any> => {
	return new Promise((resolve, reject) => {
		removeAllCookies();
		if (isRequestInProgress) {
			return reject(new Error('Request in progress'));
		}
		isRequestInProgress = true;
		const xhr = new XMLHttpRequest();
		xhr.open('POST', url);
		xhr.onreadystatechange = function () {
			if (xhr.readyState > 3 && xhr.status === 201) {
				autoLogin({
					username: data['username'],
					password: decodeURIComponent(data['password']),
					redirect: false
				})
					.then(resolve)
					.catch(reject);
			} else if (xhr.readyState > 3 && xhr.status === 409) {
				handleRegistrationConflictError(xhr);
				isRequestInProgress = false;
				reject(xhr);
			} else if (
				xhr.readyState > 3 &&
				xhr.status !== 201 &&
				xhr.status !== 409
			) {
				const error = getErrorCaseForStatus(xhr.status);
				redirectToErrorPage(error);
				reject(error);
			}
		};
		const csrfToken = generateCsrfToken();

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
		xhr.withCredentials = true;
		xhr.send(JSON.stringify(data));
	});
};
