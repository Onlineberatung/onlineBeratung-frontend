import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { AgencyDataInterface } from '../globalState/interfaces';
import { loadConsultingTypeForAgency } from '../utils/loadConsultingTypeForAgency';

export const apiGetAgencyById = async (
	agencyId: number,
	fetchConsultingTypeDetails?: boolean
): Promise<AgencyDataInterface> => {
	const url = endpoints.agencyServiceBase + '/' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	})
		.then((response) => response[0])
		.then(async (agency) => {
			if (!fetchConsultingTypeDetails || !agency) {
				return agency;
			}

			return await loadConsultingTypeForAgency(agency);
		});
};
