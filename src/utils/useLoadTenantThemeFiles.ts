import { useCallback, useContext, useEffect } from 'react';
import { TenantContext } from '../globalState';

const useLoadTenantThemeFiles = () => {
	const { setTenant } = useContext(TenantContext);
	let host = window.location.host;
	let parts = host.split('.') || [];

	let subdomain = '';
	// If we get more than 3 parts, then we have a subdomain (but not on localhost)
	// INFO: This could be 4, if you have a co.uk TLD or something like that.
	if (parts?.length >= 3 || parts[1]?.includes('localhost')) {
		subdomain = parts[0];
	}

	const loadCSS = useCallback(
		(file) => {
			if (subdomain.length > 0) {
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = file;
				document.head.appendChild(link);
				link.onload = function () {
					if (subdomain) {
						setTenant({ subdomain, domain: host });
					}
				};
			} else {
				setTenant({});
			}
		},
		[setTenant, subdomain, host]
	);
	useEffect(() => {
		loadCSS(`/themes/${subdomain}/theme.css`);
	}, [subdomain, setTenant, loadCSS]);
};

export default useLoadTenantThemeFiles;
