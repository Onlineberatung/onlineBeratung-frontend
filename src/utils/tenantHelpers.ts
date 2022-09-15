import { TenantDataSettingsInterface } from '../globalState/interfaces/TenantDataInterface';

export const ensureTenantSettings = (
	tenantSettings: TenantDataSettingsInterface
) => {
	return tenantSettings.featureToolsEnabled
		? {
				tenantSettings
		  }
		: null;
};
