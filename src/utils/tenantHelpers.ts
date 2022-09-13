import { TenantDataSettingsInterface } from '../globalState/interfaces/TenantDataInterface';

export const ensureTenantSettings = (
	tenantSettings: TenantDataSettingsInterface,
	enableBudibaseSSO: boolean
) => {
	return enableBudibaseSSO
		? {
				tenantSettings
		  }
		: null;
};
