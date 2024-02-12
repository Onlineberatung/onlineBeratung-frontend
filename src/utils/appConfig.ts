import { AppConfigInterface } from '../globalState/interfaces';

// Make app config available globally to be used on other files that are just js context
export let appConfig: AppConfigInterface = null;

export const setAppConfig = (config: AppConfigInterface) => {
	appConfig = config;
};
