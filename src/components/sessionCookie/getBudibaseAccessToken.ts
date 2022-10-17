import { TenantDataSettingsInterface } from '../../globalState/interfaces/TenantDataInterface';
import { appConfig } from '../../utils/appConfig';

(window as any).defaultTimeout = 10000;
export const getBudibaseAccessToken = (
	username: string,
	password: string,
	tenantSettings: TenantDataSettingsInterface,
	tryCount = 0
): Promise<any> => {
	return new Promise(async (resolve) => {
		//Budibase doesn't work on localhost so we don't do the sso for budibase
		if (window.location.href.indexOf('localhost') !== -1) {
			resolve(undefined);
			return;
		}
		const userName = decodeURIComponent(username)?.toLowerCase();
		const budibaseUrl = appConfig.budibaseUrl;
		let count = 0;
		const login = () => {
			count += 1;

			if (count > 1) {
				// After we submit the user credentials we'll be redirected tools so we need to wait to be there
				(function waitForLogin(tryCount = 0) {
					const iframe = document.getElementById('authIframe');
					if ((iframe as any)?.contentDocument && tryCount < 3) {
						setTimeout(() => waitForLogin(tryCount + 1), 1000);
						return;
					} else {
						resolve(undefined);
					}
				})();
				return;
			}

			// When we first start the login process we need to call the budibase sso and only then we're redirected
			// to the keycloak form so we need to wait until we can put insert the credentials in the form
			// If for some reason we still don't find the form we need to resolve it because the login will not work
			const iframe = document.getElementById('authIframe');
			if (!(iframe as any).contentDocument && tryCount < 3) {
				setTimeout(() => {
					getBudibaseAccessToken(
						userName,
						password,
						tenantSettings,
						tryCount + 1
					)
						.then(resolve)
						.catch(resolve);
				}, 500);
				return;
			}

			const authIframe = (
				document.getElementById('authIframe') as HTMLIFrameElement
			).contentDocument;
			if (authIframe?.getElementById('password')) {
				(
					authIframe?.getElementById('password') as HTMLInputElement
				).value = password;
			}
			if (authIframe?.getElementById('username')) {
				(
					authIframe?.getElementById('username') as HTMLInputElement
				).value = userName;
			}
			if (authIframe?.getElementById('kc-form-login')) {
				(
					authIframe?.getElementById(
						'kc-form-login'
					) as HTMLFormElement
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
	});
};
