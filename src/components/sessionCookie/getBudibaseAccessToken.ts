import { TenantDataSettingsInterface } from '../../globalState/interfaces/TenantDataInterface';

export const getBudibaseAccessToken = (
	username: string,
	password: string,
	tenantSettings: TenantDataSettingsInterface
) => {
	const login = () => {
		const authIframe = (
			document.getElementById('authIframe') as HTMLIFrameElement
		).contentDocument;
		(authIframe.getElementById('password') as HTMLInputElement).value =
			password;
		(authIframe.getElementById('username') as HTMLInputElement).value =
			username;
		(
			authIframe.getElementById('kc-form-login') as HTMLFormElement
		).submit();
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
