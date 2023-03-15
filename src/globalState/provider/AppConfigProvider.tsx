import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { apiServerSettings } from '../../api/apiServerSettings';
import { AppConfigInterface } from '../interfaces/AppConfig';
import { setAppConfig as setAppConfigGlobal } from '../../utils/appConfig';

export const AppConfigContext = createContext<AppConfigInterface>(null);

const transformReleaseToggles = (
	releaseToggles: Record<string, string>
): Record<string, Record<string, boolean>> => {
	return {
		releaseToggles: Object.entries(releaseToggles).reduce(
			(current, [toggleKey, value]) => ({
				...current,
				[toggleKey]: value === 'true'
			}),
			{}
		)
	};
};

export const AppConfigProvider = ({
	children,
	config
}: {
	children: ReactNode;
	config: AppConfigInterface;
}) => {
	const [appConfig, setAppConfig] = useState<AppConfigInterface>(config);
	const [loading, setLoading] = useState(config.useApiClusterSettings);

	useEffect(() => {
		setAppConfigGlobal(appConfig);
	}, [appConfig]);

	useEffect(() => {
		config.useApiClusterSettings &&
			apiServerSettings().then((serverSettings) => {
				setAppConfig((appConfig) => {
					return Object.keys(serverSettings ?? {}).reduce(
						(current, key) => {
							if (key === 'releaseToggles') {
								return {
									...current,
									...transformReleaseToggles(
										serverSettings[key]
									)
								};
							}

							return {
								...current,
								[key]: serverSettings[key]?.value
							};
						},
						appConfig
					);
				});
				setLoading(false);
			});
	}, [config.useApiClusterSettings]);

	if (loading) {
		return null;
	}

	return (
		<AppConfigContext.Provider value={appConfig}>
			{children}
		</AppConfigContext.Provider>
	);
};
