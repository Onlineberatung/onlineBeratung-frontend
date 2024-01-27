import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { AgencyDataInterface } from '../globalState/interfaces';

export const apiGetAgencyById = async (
	agencyId: any
): Promise<AgencyDataInterface> => {
	const url = endpoints.agencyServiceBase + '/' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	}).then((response) => response[0]);
};
