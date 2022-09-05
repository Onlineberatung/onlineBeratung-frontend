import { TenantDataSettingsInterface } from '../globalState/interfaces/TenantDataInterface';
import { config } from '../resources/scripts/config';

export const ensureTenantSettings = (
	tenantSettings: TenantDataSettingsInterface
) => {
	return config.budibaseSSO
		? {
				tenantSettings
		  }
		: null;
};
