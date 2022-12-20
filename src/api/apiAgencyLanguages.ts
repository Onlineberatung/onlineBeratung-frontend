import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';

import { AgencyLanguagesInterface } from '../globalState';

export const apiAgencyLanguages = async (
	agencyId: number,
	useMultiTenancyWithSingleDomain: boolean
): Promise<AgencyLanguagesInterface> => {
	const url = endpoints.consultantsLanguages + '?agencyId=' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [],
		...(useMultiTenancyWithSingleDomain && {
			headersData: { agencyId }
		})
	});
};
