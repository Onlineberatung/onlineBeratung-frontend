import { v4 as uuidv4 } from 'uuid';
import { removeAllCookies } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';
import { ErrorInfo } from 'react';
import { ErrorBoundaryError } from '../components/app/ErrorBoundary';

export interface ErrorResponse {}

export type ErrorRequestBody = {
	request: {
		correlationId: string;
		timestamp: string;
	};
	serviceName: string;
	error: ErrorBoundaryError;
	info: ErrorInfo;
};

export const apiPostError = async (
	error: ErrorBoundaryError,
	info: ErrorInfo
): Promise<ErrorResponse> => {
	const url = config.endpoints.error;
	const bodyData: ErrorRequestBody = {
		request: {
			correlationId: uuidv4(),
			timestamp: new Date().toISOString()
		},
		serviceName: 'frontend',
		error,
		info
	};

	removeAllCookies();

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: JSON.stringify(bodyData),
		skipAuth: true
	});
};
