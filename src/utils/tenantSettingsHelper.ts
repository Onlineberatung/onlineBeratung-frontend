import { TenantDataSettingsInterface } from '../globalState/interfaces';

// Make tenant available globally to be used on other files that are just js context
const tenantSettings: Partial<TenantDataSettingsInterface> = {};

export const setTenantSettings = (settings: TenantDataSettingsInterface) => {
	return Object.assign(tenantSettings, settings);
};

export const getTenantSettings = () => {
	return tenantSettings;
};
