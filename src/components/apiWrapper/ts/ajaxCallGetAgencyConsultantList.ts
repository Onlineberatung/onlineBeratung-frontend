import { config } from '../../../resources/ts/config';
import { Consultant } from '../../sessionAssign/ts/SessionAssign';
import { fetchData, FETCH_METHODS } from './fetchData';

export const getAgencyConsultantList = async (
	agencyId: string
): Promise<Consultant[]> => {
	const url = config.endpoints.agencyConsultants + '?agencyId=' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
