import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const getAgencyById = async (agencyId: any): Promise<any> => {
	const url = config.endpoints.agencyById + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	});
};
