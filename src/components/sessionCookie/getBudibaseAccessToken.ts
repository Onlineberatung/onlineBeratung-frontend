export const getBudibaseAccessToken = (
	username: string,
	password: string
): Promise<Boolean> =>
	new Promise((resolve, reject) => {
		debugger;
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
			'https://budibase-dev.suchtberatung.digital/api/global/auth/default/oidc/configs/c9d14239e5a004c2080344375b1725220'
		);
		ifrm.onload = login;
		ifrm.id = 'authIframe';
		ifrm.style.display = 'none';
		document.body.appendChild(ifrm);
		resolve(true);
	});
