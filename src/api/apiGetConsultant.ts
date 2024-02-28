import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ConsultantDataInterface } from '../globalState/interfaces';
import { apiGetConsultingType } from './apiGetConsultingType';

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
	}).then((user: ConsultantDataInterface) => {
		if (!fetchConsultingTypeDetails) {
			return user;
		}

		// Get unique consultingTypes to prevent multiple requests to api
		const uniqueConsultingTypeIds = [
			...new Set(
				user.agencies.map((a) => a?.consultingType).filter(Boolean)
			)
		];

		return Promise.all(
			uniqueConsultingTypeIds.map((consultingTypeId) =>
				apiGetConsultingType({
					consultingTypeId
				})
			)
		).then((consultingTypes) => ({
			...user,
			agencies: user.agencies.map((a) => ({
				...a,
				consultingTypeRel: consultingTypes.find(
					(c) => c.id === a.consultingType
				)
			}))
		}));
	});
};
