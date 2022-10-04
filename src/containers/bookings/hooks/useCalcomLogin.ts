import { UserDataContext } from '../../../globalState';
import { config } from '../../../resources/scripts/config';
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
				url: config.endpoints.counselorToken,
				method: FETCH_METHODS.GET
			});

			await fetch(
				`${settings.calcomUrl}/api/auth/callback/credentials?`,
				{
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					body: `csrfToken=${csrfRequest.csrfToken}&email=${userData.email}&password=${tokenResponse.token}&callbackUrl=${settings.calcomUrl}%2F&redirect=false&json=true`,
					method: 'POST',
					credentials: 'include'
				}
			).then(() => setLoadedExternal(true));
		})();
	}, [settings.calcomUrl, userData.email]);

	return loadedExternal;
};
