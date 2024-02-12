import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { apiServerSettings } from '../../api/apiServerSettings';
import { AppConfigInterface } from '../interfaces';
import { setAppConfig as setAppConfigGlobal } from '../../utils/appConfig';
import { apiFrontendSettings } from '../../api/apiFrontendSettings';

export const AppConfigContext = createContext<AppConfigInterface>(null);

const transformReleaseToggles = (
	releaseToggles: Record<string, string>
): Record<string, Record<string, boolean>> => {
	return Object.entries(releaseToggles).reduce(
		(current, [toggleKey, value]) => ({
			...current,
			[toggleKey]: typeof value === 'string' ? value === 'true' : value
		}),
		{}
	);
};

export const AppConfigProvider = ({
	children,
	config
}: {
	children: ReactNode;
	config: AppConfigInterface;
}) => {
	const [appConfig, setAppConfig] = useState<AppConfigInterface>();

	useEffect(() => {
		setAppConfigGlobal(appConfig);
	}, [appConfig]);

	useEffect(() => {
		apiFrontendSettings()
			.then((frontendSettings) => ({
				...config,
				...frontendSettings
			}))
			.catch(() => config)
			.then((config) =>
				config.useApiClusterSettings
					? apiServerSettings().then((serverSettings) =>
							Object.keys(serverSettings ?? {}).reduce(
								(current, key) => {
									current[key] =
										key === 'releaseToggles'
											? transformReleaseToggles(
													serverSettings[key]
												)
											: serverSettings[key]?.value;
									return current;
								},
								config
							)
						)
					: config
			)
			.then(setAppConfig);
	}, [config]);

	if (!appConfig) {
		return null;
	}

	return (
		<AppConfigContext.Provider value={appConfig}>
			{children}
		</AppConfigContext.Provider>
	);
};
