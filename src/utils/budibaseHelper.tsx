import { useCallback } from 'react';
import { useTenant } from '../globalState';
import { config } from '../resources/scripts/config';

export const useLoginBudiBase = () => {
	const tenantData = useTenant();
	const loginBudiBase = useCallback(() => {
		const ifrm = document.createElement('iframe');
		ifrm.setAttribute(
			'src',
			`${config.urls.budibaseDevServer}/api/global/auth/default/oidc/configs/${tenantData?.settings?.featureToolsOICDToken}`
		);
		ifrm.id = 'authIframe2';
		ifrm.style.display = 'none';
		document.body.appendChild(ifrm);
		setTimeout(() => {
			document.querySelector('#authIframe2').remove();
		}, 5000);
	}, [tenantData?.settings?.featureToolsOICDToken]);

	return { loginBudiBase };
};
