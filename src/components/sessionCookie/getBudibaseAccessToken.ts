import { TenantDataSettingsInterface } from '../../globalState/interfaces/TenantDataInterface';
import { getAppSettings } from '../../utils/settingsHelper';

export const getBudibaseAccessToken = (
	username: string,
	password: string,
	tenantSettings: TenantDataSettingsInterface
) => {
	const { budibaseUrl } = getAppSettings();
	const login = () => {
		const authIframe = (
			document.getElementById('authIframe') as HTMLIFrameElement
		).contentDocument;
		if (authIframe?.getElementById('password')) {
			(authIframe?.getElementById('password') as HTMLInputElement).value =
				password;
		}
		if (authIframe?.getElementById('username')) {
			(authIframe?.getElementById('username') as HTMLInputElement).value =
				username;
		}
		if (authIframe?.getElementById('kc-form-login')) {
			(
				authIframe?.getElementById('kc-form-login') as HTMLFormElement
			).submit();
		}
	};

	const ifrm = document.createElement('iframe');
	ifrm.setAttribute(
		'src',
		`${budibaseUrl}/api/global/auth/default/oidc/configs/${tenantSettings.featureToolsOICDToken}`
	);
	ifrm.onload = login;
	ifrm.id = 'authIframe';
	ifrm.style.display = 'none';
	document.body.appendChild(ifrm);
};
