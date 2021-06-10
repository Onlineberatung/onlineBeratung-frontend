import { getTokenFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { generateCsrfToken } from '../utils/generateCsrfToken';
import {
	getErrorCaseForStatus,
	redirectToErrorPage
} from '../components/error/errorHandling';
import { logout } from '../components/logout/logout';

const isIE11Browser =
	window.navigator.userAgent.indexOf('MSIE ') > 0 ||
	!!navigator.userAgent.match(/Trident.*rv:11\./);

export const FETCH_METHODS = {
	DELETE: 'DELETE',
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT'
};

export const FETCH_ERRORS = {
	ABORT: 'ABORT',
	EMPTY: 'EMPTY',
	BAD_REQUEST: 'BAD_REQUEST',
	CONFLICT: 'CONFLICT',
	CONFLICT_WITH_RESPONSE: 'CONFLICT_WITH_RESPONSE',
	TIMEOUT: 'TIMEOUT',
	NO_MATCH: 'NO_MATCH',
	CATCH_ALL: 'CATCH_ALL',
	X_REASON: 'X-Reason'
};

export const X_REASON = {
	EMAIL_NOT_AVAILABLE: 'EMAIL_NOT_AVAILABLE'
};

export const FETCH_SUCCESS = {
	CONTENT: 'CONTENT'
};

interface FetchDataProps {
	url: string;
	method: string;
	headersData?: object;
	rcValidation?: boolean;
	bodyData?: string;
	skipAuth?: boolean;
	responseHandling?: string[];
	timeout?: number;
	signal?: AbortSignal;
}

export const fetchData = (props: FetchDataProps): Promise<any> =>
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

		let controller;
		if (!isIE11Browser) {
			controller = new AbortController();
			if (props.timeout) {
				setTimeout(() => controller.abort(), props.timeout);
			}
			if (props.signal) {
				props.signal.addEventListener('abort', () =>
					controller.abort()
				);
			}
		}

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
			body: props.bodyData,
			...(!isIE11Browser && { signal: controller.signal })
		});

		fetch(req)
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
						props.responseHandling.includes(
							FETCH_ERRORS.BAD_REQUEST
						)
					) {
						reject(new Error(FETCH_ERRORS.BAD_REQUEST));
					} else if (
						response.status === 404 &&
						props.responseHandling.includes(FETCH_ERRORS.NO_MATCH)
					) {
						reject(new Error(FETCH_ERRORS.NO_MATCH));
					} else if (
						response.status === 409 &&
						(props.responseHandling.includes(
							FETCH_ERRORS.CONFLICT
						) ||
							props.responseHandling.includes(
								FETCH_ERRORS.CONFLICT_WITH_RESPONSE
							))
					) {
						reject(
							props.responseHandling.includes(
								FETCH_ERRORS.CONFLICT_WITH_RESPONSE
							)
								? response
								: new Error(FETCH_ERRORS.CONFLICT)
						);
					} else if (response.status === 401) {
						logout(true);
					}
				} else {
					const error = getErrorCaseForStatus(response.status);
					redirectToErrorPage(error);
					reject(new Error('api call error'));
				}
			})
			.catch((error) => {
				if (props.signal.aborted && error.name === 'AbortError') {
					reject(new Error(FETCH_ERRORS.ABORT));
				} else if (error.name === 'AbortError') {
					reject(new Error(FETCH_ERRORS.TIMEOUT));
				} else {
					reject(error);
				}
			});
	});
