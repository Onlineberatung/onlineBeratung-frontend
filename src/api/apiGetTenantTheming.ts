import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { config } from '../resources/scripts/config';
import { TenantDataInterface } from '../globalState/interfaces/TenantDataInterface';

const MAIN_TENANT_SINGLE_DOMAIN = 'app';
export const apiGetTenantTheming = async (params: {
	subdomain: string;
	useMultiTenancyWithSingleDomain: boolean;
}): Promise<TenantDataInterface> =>
	fetchData({
		url: `${config.endpoints.tenantServiceBase}/public/${
			params.useMultiTenancyWithSingleDomain
				? MAIN_TENANT_SINGLE_DOMAIN
				: params.subdomain
		}`,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
