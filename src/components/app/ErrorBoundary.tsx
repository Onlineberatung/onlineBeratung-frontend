import React, { Component, ReactNode } from 'react';
import {
	apiPostError,
	ERROR_LEVEL_FATAL,
	TError
} from '../../api/apiPostError';
import { redirectToErrorPage } from '../error/errorHandling';
import { Loading } from './Loading';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { STORAGE_KEY_ERROR_BOUNDARY } from '../devToolbar/DevToolbar';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
	window?: Window;
};

export type ErrorBoundaryError = TError;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
		window: null
	};

	prevError: null | Error = null;

	componentDidMount() {
		this.setState({
			window: typeof window !== 'undefined' ? window : null
		});
	}

	componentDidCatch(error, info) {
		if (
			(process.env.REACT_APP_DISABLE_ERROR_BOUNDARY &&
				parseInt(process.env.REACT_APP_DISABLE_ERROR_BOUNDARY) === 1) ||
			(localStorage.getItem(STORAGE_KEY_ERROR_BOUNDARY) ?? '1') === '0'
		) {
			console.error('ErrorBoundary disabled!');
			return;
		}

		const { window } = this.state;

		const isNewError =
			!this.prevError || error.toString() !== this.prevError.toString();

		if (!isNewError) return;

		this.prevError = error;

		const errorBoundaryError: ErrorBoundaryError = {
			name: error.name,
			message: error.message,
			stack: error.stack,
			level: ERROR_LEVEL_FATAL
		};

		if (
			window &&
			(window.navigator || window.location || window.document)
		) {
			errorBoundaryError.url = window.location?.href;
			const { referrer } = window.document || {};
			const { userAgent } = window.navigator || {};

			errorBoundaryError.headers = {
				...(referrer && { Referer: referrer }),
				...(userAgent && { 'User-Agent': userAgent })
			};
		}

		apiPostError(errorBoundaryError, info).finally(() => {
			removeAllCookies();
			redirectToErrorPage(500);
		});
	}

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <Loading />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
