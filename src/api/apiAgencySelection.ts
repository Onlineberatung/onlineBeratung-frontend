import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { VALID_POSTCODE_LENGTH } from '../components/agencySelection/agencySelectionHelpers';
import { AgencyDataInterface } from '../globalState';
import { apiGetConsultingType } from './apiGetConsultingType';
import { apiGetConsultingTypes } from './apiGetConsultingTypes';

export const apiAgencySelection = async (
	{
		fetchConsultingTypes,
		consultingTypeDetail,
		...params
	}: {
		postcode: string;
		consultingType: number | undefined;
		topicId?: number;
		fetchConsultingTypes?: boolean;
		consultingTypeDetail?: 'full' | 'basic';
	},
	signal?: AbortSignal
): Promise<Array<AgencyDataInterface> | null> => {
	let queryStr = Object.keys(params)
		.filter((key) => params[key] !== undefined)
		.map((key) => key + '=' + params[key])
		.join('&');
	const url = endpoints.agencyServiceBase + '?' + queryStr;

	if (params.postcode.length === VALID_POSTCODE_LENGTH) {
		return fetchData({
			url: url,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_ERRORS.EMPTY],
			...(signal && { signal: signal })
		})
			.then((result) => {
				if (result) {
					// External agencies should only be returned
					// if there are no internal ones.
					const internalAgencies = result.filter(
						(agency) => !agency.external
					);
					if (internalAgencies.length > 0) {
						return internalAgencies;
					} else {
						return result;
					}
				} else {
					return result;
				}
			})
			.then((agencies) => {
				if (!fetchConsultingTypes) {
					return agencies;
				}

				if (consultingTypeDetail === 'full') {
					return Promise.all(
						agencies.map(async (agency) => ({
							...agency,
							consultingTypeRel: await apiGetConsultingType({
								consultingTypeId: agency?.consultingType
							})
						}))
					);
				}

				if (consultingTypeDetail === 'basic') {
					return apiGetConsultingTypes().then((consultingTypes) => {
						return agencies.map((agency) => {
							const consultingTypeRel = consultingTypes.filter(
								(type) => type.id === agency.consultingType
							)[0];
							return {
								...agency,
								consultingTypeRel: { ...consultingTypeRel }
							};
						});
					});
				}
			});
	} else {
		return null;
	}
};
