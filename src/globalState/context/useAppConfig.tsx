import React, { useCallback, useEffect } from 'react';
import { apiServerSettings } from '../../api/apiServerSettings';
import { config } from '../../resources/scripts/config';
import { AppSettingsInterface } from '../interfaces/AppConfig/AppSettingsInterface';
import { ServerAppConfigInterface } from '../interfaces/ServerAppConfigInterface';

const UseAppConfigContext = React.createContext<AppSettingsInterface>(null);

const UseAppConfigProvider = ({
	children
}: {
	children?: React.ReactChild | React.ReactChild[];
}) => {
	const [appConfig, setAppConfig] = React.useState<AppSettingsInterface>({
		budibaseSSO: config.budibaseSSO,
		enableWalkThrough: config.enableWalkThrough,
		disableVideoAppointments: config.disableVideoAppointments,
		multitenancyWithSingleDomainEnabled:
			config.multitenancyWithSingleDomainEnabled,
		useTenantService: config.useTenantService,
		useApiClusterSettings: config.useApiClusterSettings
	});

	const setServerSettings = useCallback(
		(serverSettings: ServerAppConfigInterface) => {
			const finalServerSettings = Object.keys(serverSettings).reduce(
				(current, key) => ({
					...current,
					[key]: serverSettings[key].value
				}),
				{} as Partial<AppSettingsInterface>
			);

			setAppConfig({
				...appConfig,
				...finalServerSettings
			});
		},
		[appConfig]
	);

	useEffect(() => {
		config.useApiClusterSettings &&
			apiServerSettings().then((serverSettings) => {
				setServerSettings(serverSettings || {});
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<UseAppConfigContext.Provider value={appConfig}>
			{children}
		</UseAppConfigContext.Provider>
	);
};

const useAppConfigContext = (): AppSettingsInterface => {
	return React.useContext(UseAppConfigContext);
};

export { UseAppConfigProvider, useAppConfigContext };
