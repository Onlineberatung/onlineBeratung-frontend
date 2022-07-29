import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

export interface Consultant {
	consultantId: string;
	firstName: string;
	lastName: string;
	displayName: string;
	username: string;
}

export const apiGetAgencyConsultantList = async (
	agencyId: string
): Promise<Consultant[]> => {
	const url = config.endpoints.agencyConsultants + '?agencyId=' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
