import { useCallback, useContext, useEffect } from 'react';
import { TenantContext } from '../globalState';

export const getLocationVariables = () => {
	const location = window.location;
	const { host, protocol, origin } = location;
	let parts = host.split('.') || [];
	let subdomain = '';
	// If we get more than 3 parts, then we have a subdomain (but not on localhost)
	// INFO: This could be 4, if you have a co.uk TLD or something like that.
	if (parts?.length >= 3 || parts[1]?.includes('localhost')) {
		subdomain = parts[0];
	}

	return { subdomain, host, protocol, origin };
};

const useLoadTenantThemeFiles = () => {
	const { setTenant } = useContext(TenantContext);
	const { subdomain, host, protocol, origin } = getLocationVariables();
	const loadCSS = useCallback(
		(file) => {
			if (subdomain.length > 0) {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = file;
				document.head.appendChild(link);
				link.onload = function () {
					if (subdomain) {
						setTenant({ subdomain, host, protocol, origin });
					}
				};
			} else {
				setTenant({});
			}
		},
		[setTenant, subdomain, host, protocol, origin]
	);
	useEffect(() => {
		loadCSS(`/themes/${subdomain}/theme.css`);
	}, [subdomain, setTenant, loadCSS]);
};

export default useLoadTenantThemeFiles;
