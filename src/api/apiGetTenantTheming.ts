import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { endpoints } from '../resources/scripts/endpoints';
import { TenantDataInterface } from '../globalState/interfaces/TenantDataInterface';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';

interface GetTenantThemingParams {
	subdomain: string;
	useMultiTenancyWithSingleDomain: boolean;
	mainTenantSubdomainForSingleDomain: string;
}

export const apiGetTenantTheming = async ({
	subdomain,
	useMultiTenancyWithSingleDomain,
	mainTenantSubdomainForSingleDomain
}: GetTenantThemingParams): Promise<TenantDataInterface> => {
	const tenantId = getValueFromCookie('tenantId');
	const tenantParam = tenantId ? `?tenantId=${tenantId || 0}` : '';

	return fetchData({
		url: `${endpoints.tenantServiceBase}/public/${
			useMultiTenancyWithSingleDomain
				? mainTenantSubdomainForSingleDomain
				: subdomain
		}${tenantParam}`,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
};
