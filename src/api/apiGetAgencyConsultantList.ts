import { config } from '../resources/scripts/config';
import { Consultant } from '../components/sessionAssign/SessionAssign';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetAgencyConsultantList = async (
	agencyId: string
): Promise<Consultant[]> => {
	const url = config.endpoints.agencyConsultants + '?agencyId=' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
