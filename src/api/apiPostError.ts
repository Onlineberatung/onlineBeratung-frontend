import { v4 as uuidv4 } from 'uuid';
import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ErrorInfo } from 'react';
import StackTrace from 'stacktrace-js';

export interface ErrorResponse {}

export const ERROR_LEVEL_FATAL = 'FATAL';
export const ERROR_LEVEL_ERROR = 'ERROR';
export const ERROR_LEVEL_WARN = 'WARN';
export const ERROR_LEVEL_INFO = 'INFO';
export const ERROR_LEVEL_DEBUG = 'DEBUG';
export const ERROR_LEVEL_TRACE = 'TRACE';

type TErrorHeaders = {
	'User-Agent'?: string;
	'Referer'?: string;
};

export type TError = Error & {
	level?:
		| typeof ERROR_LEVEL_FATAL
		| typeof ERROR_LEVEL_ERROR
		| typeof ERROR_LEVEL_WARN
		| typeof ERROR_LEVEL_INFO
		| typeof ERROR_LEVEL_DEBUG
		| typeof ERROR_LEVEL_TRACE;
	url?: string;
	headers?: TErrorHeaders;
	parsedStack?: string;
};

export type ErrorRequestBody = {
	request: {
		correlationId: string;
		timestamp: string;
	};
	serviceName: string;
	error: TError;
	info?: ErrorInfo;
};

export const apiPostError = async (
	error: TError,
	info?: ErrorInfo,
	correlationId?: string
): Promise<ErrorResponse> => {
	const url = endpoints.error;

	if (window) {
		if (window.location?.href) {
			error.url = window.location.href;
		}

		if (window.document && !error?.headers?.Referer) {
			const { referrer } = window.document || {};

			error.headers = {
				...error.headers,
				...(referrer && { Referer: referrer })
			};
		}

		if (window.navigator && !error?.headers?.['User-Agent']) {
			const { userAgent } = window.navigator || {};

			error.headers = {
				...error.headers,
				...(userAgent && { 'User-Agent': userAgent })
			};
		}
	}

	if (error.stack && !error.parsedStack) {
		error.parsedStack = await StackTrace.fromError(error).then(
			(stackFrames) => {
				return stackFrames.map((sf) => sf.toString()).join('\n');
			}
		);
	}

	const bodyData: ErrorRequestBody = {
		request: {
			correlationId: correlationId || uuidv4(),
			timestamp: new Date().toISOString()
		},
		serviceName: 'frontend',
		error,
		...(info ? { info: info } : {})
	};

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(bodyData),
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	}).catch((e) => {
		console.log('Logging error failed: ', e);
		return e;
	});
};
