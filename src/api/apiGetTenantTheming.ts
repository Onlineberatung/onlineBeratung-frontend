import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { TenantDataInterface } from '../globalState/interfaces/TenantDataInterface';
import { config } from '../resources/scripts/config';

export const apiGetTenantTheming = async (params: {
	subdomain: string;
}): Promise<TenantDataInterface> =>
	fetchData({
		url: config.endpoints.tenantServiceBase + '/public/' + params.subdomain,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
