import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { AgencyDataInterface } from '../globalState';
import { apiGetConsultingType } from './apiGetConsultingType';
import { apiGetConsultingTypes } from './apiGetConsultingTypes';

export const apiGetAgencyById = async (
	agencyId: any,
	fetchConsultingTypes?: boolean,
	consultingTypeDetail: 'full' | 'basic' = 'full'
): Promise<AgencyDataInterface> => {
	const url = endpoints.agencyServiceBase + '/' + agencyId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.NO_MATCH]
	})
		.then((response) => response[0])
		.then((agency) => {
			if (!fetchConsultingTypes) {
				return agency;
			}

			if (consultingTypeDetail === 'full') {
				return apiGetConsultingType({
					consultingTypeId: agency?.consultingType
				}).then((consultingTypeRel) => ({
					...agency,
					consultingTypeRel
				}));
			}

			if (consultingTypeDetail === 'basic') {
				return apiGetConsultingTypes().then((consultingTypes) => {
					const consultingTypeRel = consultingTypes.find(
						(type) => type.id === agency.consultingType
					);

					return {
						...agency,
						consultingTypeRel
					};
				});
			}

			return agency;
		});
};
