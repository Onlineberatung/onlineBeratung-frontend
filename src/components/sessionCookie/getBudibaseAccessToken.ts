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
		const budibaseUrl = appConfig.budibaseUrl;
		let count = 0;
		const login = () => {
			count += 1;

			if (count > 1) {
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

			const iframe = document.getElementById('authIframe');
			if (!(iframe as any).contentDocument && tryCount < 3) {
				setTimeout(() => {
					getBudibaseAccessToken(
						username,
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
				).value = username;
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
