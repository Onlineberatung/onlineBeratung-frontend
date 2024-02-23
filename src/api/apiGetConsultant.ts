import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ConsultantDataInterface } from '../globalState/interfaces';
import { loadConsultingTypeForAgency } from '../utils/loadConsultingTypeForAgency';

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
	}).then((user) => {
		if (!fetchConsultingTypeDetails) {
			return user;
		}

		return Promise.all(
			user.agencies.map(
				async (agency) => await loadConsultingTypeForAgency(agency)
			)
		).then(
			(agencies): ConsultantDataInterface => ({
				...user,
				agencies
			})
		);
	});
};
