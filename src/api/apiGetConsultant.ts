import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ConsultantDataInterface } from '../globalState/interfaces';
import { loadConsultingTypesForAgencies } from '../utils/loadConsultingTypesForAgencies';

export const apiGetConsultant = async (
	consultantId: string,
	fetchConsultingTypeDetails?: boolean
): Promise<ConsultantDataInterface> => {
	const url = endpoints.agencyConsultants + '/' + consultantId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	}).then(async (user: ConsultantDataInterface) => {
		if (!fetchConsultingTypeDetails) {
			return user;
		}

		return {
			...user,
			agencies: await loadConsultingTypesForAgencies(user.agencies)
		};
	});
};
