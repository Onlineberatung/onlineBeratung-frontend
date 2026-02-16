import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

/**
 * Redirects root path (/) based on URL parameters:
 * - If any parameters present (aid, cid, postcode) → /beratung/registration
 * - Otherwise → /welcome
 */
export const RootRedirect = () => {
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const hasParams = params.has('aid') || params.has('cid') || params.has('postcode');

		if (hasParams) {
			// Redirect to registration with parameters
			history.replace(`/beratung/registration${location.search}`);
		} else {
			// Redirect to welcome screen
			history.replace('/welcome');
		}
	}, [history, location]);

	return null;
};
