import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ConsultantDataInterface } from '../globalState';
import { apiGetConsultingType } from './apiGetConsultingType';

export const apiGetConsultant = async (
	consultantId: any,
	fetchConsultingTypes?: boolean
): Promise<ConsultantDataInterface> => {
	const url = config.endpoints.agencyConsultants + '/' + consultantId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	}).then((user) => {
		if (!fetchConsultingTypes) {
			return user;
		}

		return Promise.all(
			user.agencies.map(async (agency) => ({
				...agency,
				consultingTypeRel: await apiGetConsultingType({
					consultingTypeId: agency?.consultingType
				})
			}))
		).then((agencies): ConsultantDataInterface => {
			return {
				...user,
				agencies
			};
		});
	});
};
