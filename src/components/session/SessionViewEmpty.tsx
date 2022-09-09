import * as React from 'react';
import { useContext, useEffect } from 'react';
import { TenantContext } from '../../globalState';
import { config } from '../../resources/scripts/config';
import { translate } from '../../utils/translate';
import { mobileListView } from '../app/navigationHandler';
import { Text } from '../text/Text';
import './session.styles';

export const SessionViewEmpty = () => {
	const { tenant } = useContext(TenantContext);

	useEffect(() => {
		mobileListView();
		const ifrm = document.createElement('iframe');
		ifrm.setAttribute(
			'src',
			`${config.urls.budibaseDevServer}/api/global/auth/default/oidc/configs/${tenant?.settings?.featureToolsOICDToken}`
		);
		ifrm.id = 'authIframe2';
		ifrm.style.display = 'none';
		document.body.appendChild(ifrm);
	}, [tenant]);
	return (
		<div className="session session--empty">
			<Text text={translate('session.empty')} type="divider" />
		</div>
	);
};
