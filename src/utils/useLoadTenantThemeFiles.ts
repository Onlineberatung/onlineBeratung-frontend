import { useContext, useEffect } from 'react';
import { ThemeContext } from '../globalState';

const useLoadTenantThemeFiles = () => {
	const { setTheme } = useContext(ThemeContext);
	const host = window.location.host;
	let subdomain = host.split('.')[0];

	const loadCSS = (file) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = file;
		document.head.appendChild(link);
	};
	useEffect(() => {
		if (subdomain) {
			setTheme(subdomain);
		}
		loadCSS(`/themes/${subdomain}/theme.css`);
	}, [subdomain, setTheme]);
};

export default useLoadTenantThemeFiles;
