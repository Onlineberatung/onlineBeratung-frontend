import { AppConfigInterface } from '../globalState';

// Make app config available globally to be used on other files that are just js context
export const appConfig: AppConfigInterface = null;

export const setAppConfig = (config: AppConfigInterface) => {
	return Object.assign(appConfig, config);
};
