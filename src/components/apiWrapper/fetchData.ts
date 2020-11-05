import { getTokenFromCookie } from '../sessionCookie/accessSessionCookie';
import { generateCsrfToken } from '../../resources/scripts/helpers/generateCsrfToken';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../errorPage/errorHandling';
import { redirectToHelpmail } from '../registration/prefillPostcode';
import {
	isU25Registration,
	getConsultingTypeFromRegistration
} from '../../resources/scripts/helpers/resorts';

const isIE11Browser =
	window.navigator.userAgent.indexOf('MSIE ') > 0 ||
	!!navigator.userAgent.match(/Trident.*rv\:11\./);

export const FETCH_METHODS = {
	POST: 'POST',
	GET: 'GET',
	PUT: 'PUT'
};

export const FETCH_ERRORS = {
	EMPTY: 'EMPTY',
	PASSWORD: 'PASSWORD',
	CONFLICT: 'CONFLICT',
	TIMEOUT: 'TIMEOUT',
	NO_MATCH: 'NO_MATCH',
	CATCH_ALL: 'CATCH_ALL'
};

export const FETCH_SUCCESS = {
	CONTENT: 'CONTENT'
};

interface fetchDataProps {
	url: string;
	method: string;
	headersData?: object;
	rcValidation?: boolean;
	bodyData?: string;
	skipAuth?: boolean;
	responseHandling?: string[];
	timeout?: number;
}

export const fetchData = (props: fetchDataProps): Promise<any> =>
	new Promise((resolve, reject) => {
		const accessToken = getTokenFromCookie('keycloak');
		const authorization = !props.skipAuth
			? {
					Authorization: `Bearer ${accessToken}`
			  }
			: null;

		const csrfToken = generateCsrfToken();

		const rcHeaders = props.rcValidation
			? {
					rcToken: getTokenFromCookie('rc_token'),
					rcUserId: getTokenFromCookie('rc_uid')
			  }
			: null;

		const req = new Request(props.url, {
			method: props.method,
			headers: {
				'Content-Type': 'application/json',
				'cache-control': 'no-cache',
				...authorization,
				'X-CSRF-TOKEN': csrfToken,
				...props.headersData,
				...rcHeaders
			},
			credentials: 'include',
			body: props.bodyData
		});

		let controller;
		let signal;
		if (!isIE11Browser) {
			controller = new AbortController();
			signal = controller.signal;
			if (props.timeout) {
				setTimeout(() => controller.abort(), props.timeout);
			}
		}

		fetch(req, !isIE11Browser && props.timeout ? { signal } : undefined)
			.then((response) => {
				if (response.status === 200 || response.status === 201) {
					const data =
						props.method === FETCH_METHODS.GET ||
						(props.responseHandling &&
							props.responseHandling.includes(
								FETCH_SUCCESS.CONTENT
							))
							? response.json()
							: response;
					resolve(data);
				} else if (props.responseHandling) {
					if (
						props.responseHandling.includes(FETCH_ERRORS.CATCH_ALL)
					) {
						reject(new Error(FETCH_ERRORS.CATCH_ALL));
					} else if (
						response.status === 204 &&
						props.responseHandling.includes(FETCH_ERRORS.EMPTY)
					) {
						reject(new Error(FETCH_ERRORS.EMPTY));
					} else if (
						response.status === 400 &&
						props.responseHandling.includes(FETCH_ERRORS.PASSWORD)
					) {
						reject(new Error(response.status.toString()));
					} else if (
						response.status === 404 &&
						props.responseHandling.includes(FETCH_ERRORS.NO_MATCH)
					) {
						reject(new Error(FETCH_ERRORS.NO_MATCH));
					} else if (
						response.status === 409 &&
						props.responseHandling.includes(FETCH_ERRORS.CONFLICT)
					) {
						reject(getConsultingTypeFromRegistration()
							? response
							: new Error(FETCH_ERRORS.CONFLICT)
						);
					}
				} else {
					const error = getErrorCaseForStatus(response.status);
					isU25Registration()
						? redirectToHelpmail()
						: redirectToErrorPage(error);
					reject(new Error('api call error'));
				}
			})
			.catch((error) => {
				error.message === 'The operation was aborted. '
					? reject(FETCH_ERRORS.TIMEOUT)
					: reject(error);
			});
	});
