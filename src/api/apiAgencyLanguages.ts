import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

import { AgencyLanguagesInterface } from '../globalState';

export const apiAgencyLanguages = async (
	agencyId: number
): Promise<AgencyLanguagesInterface> => {
	const url = config.endpoints.consultantsLanguages + '?agencyId=' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: []
	}).then((result) => {
		return result;
	});
};
