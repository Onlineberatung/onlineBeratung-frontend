import React, { ReactNode, useEffect } from 'react';
import { apiServerSettings } from '../../api/apiServerSettings';
import { AppConfigInterface } from '../interfaces/AppConfig';

export const AppConfigContext = React.createContext<AppConfigInterface>(null);

export const AppConfigProvider = ({
	children,
	config
}: {
	children?: ReactNode;
	config: AppConfigInterface;
}) => {
	const [appConfig, setAppConfig] =
		React.useState<AppConfigInterface>(config);

	useEffect(() => {
		config.useApiClusterSettings &&
			apiServerSettings().then((serverSettings) => {
				setAppConfig((appConfig) => {
					return Object.keys(serverSettings ?? {}).reduce(
						(current, key) => ({
							...current,
							[key]: serverSettings[key].value
						}),
						appConfig
					);
				});
			});
	}, [config.useApiClusterSettings]);

	return (
		<AppConfigContext.Provider value={appConfig}>
			{children}
		</AppConfigContext.Provider>
	);
};
