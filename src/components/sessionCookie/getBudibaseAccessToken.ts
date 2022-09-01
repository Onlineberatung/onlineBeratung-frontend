import { TenantDataSettingsInterface } from '../../globalState/interfaces/TenantDataInterface';

export const getBudibaseAccessToken = (
	username: string,
	password: string,
	tenantSettings: TenantDataSettingsInterface
) => {
	const login = () => {
		const authIframe = (document.getElementById('authIframe') as any)
			.contentDocument;
		authIframe.getElementById('password').value = password;
		authIframe.getElementById('username').value = username;
		authIframe.getElementById('kc-form-login').submit();
	};

	const ifrm = document.createElement('iframe');
	ifrm.setAttribute(
		'src',
		`https://budibase-dev.suchtberatung.digital/api/global/auth/default/oidc/configs/${tenantSettings.featureToolsOICDToken}`
	);
	ifrm.onload = login;
	ifrm.id = 'authIframe';
	ifrm.style.display = 'none';
	document.body.appendChild(ifrm);
};
