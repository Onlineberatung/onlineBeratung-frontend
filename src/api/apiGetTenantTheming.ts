import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { config } from '../resources/scripts/config';
import { TenantDataInterface } from '../globalState/interfaces/TenantDataInterface';

interface GetTenantThemingParams {
	subdomain: string;
	useMultiTenancyWithSingleDomain: boolean;
	mainTenantSubdomainForSingleDomain: string;
}

export const apiGetTenantTheming = async ({
	subdomain,
	useMultiTenancyWithSingleDomain,
	mainTenantSubdomainForSingleDomain
}: GetTenantThemingParams): Promise<TenantDataInterface> =>
	fetchData({
		url: `${config.endpoints.tenantServiceBase}/public/${
			useMultiTenancyWithSingleDomain
				? mainTenantSubdomainForSingleDomain
				: subdomain
		}`,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
