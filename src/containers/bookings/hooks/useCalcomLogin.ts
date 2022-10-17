import { UserDataContext } from '../../../globalState';
import { endpoints } from '../../../resources/scripts/endpoints';
import { FETCH_METHODS, fetchData } from '../../../api';
import { useContext, useEffect, useState } from 'react';
import { useAppConfig } from '../../../hooks/useAppConfig';

export const useCalcomLogin = () => {
	const { userData } = useContext(UserDataContext);
	const [loadedExternal, setLoadedExternal] = useState(false);
	const settings = useAppConfig();

	useEffect(() => {
		(async () => {
			const csrfRequest = await fetchData({
				url: `${settings.calcomUrl}/api/auth/csrf`,
				method: FETCH_METHODS.GET
			});

			const tokenResponse = await fetchData({
				url: endpoints.counselorToken,
				method: FETCH_METHODS.GET
			});

			const body = Object.entries({
				csrfToken: csrfRequest.csrfToken,
				email: encodeURIComponent(userData.email?.toLowerCase() || ''),
				password: tokenResponse.token,
				callbackUrl: `${settings.calcomUrl}%2F`,
				redirect: false,
				json: true
			})
				.map(([key, value]) => `${key}=${value}`)
				.join('&');

			await fetch(
				`${settings.calcomUrl}/api/auth/callback/credentials?`,
				{
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					body,
					method: 'POST',
					credentials: 'include'
				}
			).then(() => setLoadedExternal(true));
		})();
	}, [settings.calcomUrl, userData.email]);

	return loadedExternal;
};
