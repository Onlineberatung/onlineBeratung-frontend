import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

import { AgencyLanguagesInterface } from '../globalState';

export const apiAgencyLanguages = async (
	agencyId: number
): Promise<AgencyLanguagesInterface> => {
	const url = config.endpoints.agencyServiceBase + '?id=' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY] // TODO ERROR HANDLING
	}).then((result) => {
		return result.languages;
	});
};
