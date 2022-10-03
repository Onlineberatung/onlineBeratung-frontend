import { useCallback } from 'react';
import { useTenant } from '../globalState';
import { useAppConfig } from '../hooks/useAppConfig';

export const useLoginBudiBase = () => {
	const tenantData = useTenant();
	const settings = useAppConfig();

	const loginBudiBase = useCallback(() => {
		const ifrm = document.createElement('iframe');
		ifrm.setAttribute(
			'src',
			`${settings.budibaseUrl}/api/global/auth/default/oidc/configs/${tenantData?.settings?.featureToolsOICDToken}`
		);
		ifrm.id = 'authIframe2';
		ifrm.style.display = 'none';
		document.body.appendChild(ifrm);
		setTimeout(() => {
			document.querySelector('#authIframe2').remove();
		}, 5000);
	}, [settings.budibaseUrl, tenantData?.settings?.featureToolsOICDToken]);

	fetch(
		`${window.location.origin}/auth/realms/online-beratung/protocol/openid-connect/logout`
	);

	return { loginBudiBase };
};
