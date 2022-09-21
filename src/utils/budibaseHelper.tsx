import React, { useCallback } from 'react';
import { Iframe } from '../components/iframe/Iframe';
import { useTenant } from '../globalState';
import { config } from '../resources/scripts/config';

export const useLoginBudiBase = () => {
	const iframeId = 'authIframe2';
	const tenantData = useTenant();
	const loginBudiBase = useCallback(() => {
		const deleteIframe = () => {
			setTimeout(() => {
				document.querySelector(`#${iframeId}`).remove();
			}, 5000);
		};

		return (
			<Iframe
				id={iframeId}
				link={`${config.urls.budibaseDevServer}/api/global/auth/default/oidc/configs/${tenantData?.settings?.featureToolsOICDToken}`}
				onLoad={deleteIframe}
			/>
		);
	}, [tenantData?.settings?.featureToolsOICDToken]);

	return { loginBudiBase };
};
