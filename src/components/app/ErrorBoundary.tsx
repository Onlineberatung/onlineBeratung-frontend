import React, { ReactNode, Component } from 'react';
import { apiPostError } from '../../api/apiPostError';
import { redirectToErrorPage } from '../error/errorHandling';
import { Loading } from './Loading';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
	window?: Window;
};

export type ErrorBoundaryError = {
	name: string;
	message: string;
	url?: string;
	headers?: {
		'User-Agent'?: string;
		'Referer'?: string;
	};
	stack: string;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
		window: null
	};

	componentDidMount() {
		this.setState({
			window: typeof window !== 'undefined' ? window : null
		});
	}

	componentDidCatch(error, info) {
		const { window } = this.state;

		const errorBoundaryError: ErrorBoundaryError = {
			name: error.name,
			message: error.message,
			stack: error.stack
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
