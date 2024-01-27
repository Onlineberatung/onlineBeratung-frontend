import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { endpoints } from '../resources/scripts/endpoints';
import { TenantDataInterface } from '../globalState/interfaces';

export const apiGetTenantTheming = async (): Promise<TenantDataInterface> => {
	return fetchData({
		url: `${endpoints.tenantServiceBase}/public/`,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
};
