import { AppSettingsInterface } from '../globalState/interfaces/AppConfig/AppSettingsInterface';

// Make app settings available globally to be used on other files that are just js context
const appSettings: Partial<AppSettingsInterface> = {};

export const setAppSettings = (settings: AppSettingsInterface) => {
	return Object.assign(appSettings, settings);
};

export const getAppSettings = () => {
	return appSettings;
};
