import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { AgencyDataInterface } from '../globalState/interfaces';
import { apiGetConsultingType } from './apiGetConsultingType';

export const apiAgencySelection = async (
	{
		fetchConsultingTypeDetails,
		...params
	}: {
		postcode?: string;
		consultingType: number | undefined;
		topicId?: number;
		age?: number;
		gender?: string;
		counsellingRelation?: string;
		fetchConsultingTypeDetails?: boolean;
	},
	signal?: AbortSignal
): Promise<AgencyDataInterface[] | null> => {
	let queryStr = Object.keys(params)
		.filter((key) => params[key] !== undefined)
		.map((key) => key + '=' + params[key])
		.join('&');
	const url = endpoints.agencyServiceBase + '?' + queryStr;

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
		.then((agencies: AgencyDataInterface[]) => {
			if (!fetchConsultingTypeDetails) {
				return agencies;
			}

			// Get unique consultingTypes to prevent multiple requests to api
			const uniqueConsultingTypeIds = [
				...new Set(
					agencies.map((a) => a?.consultingType).filter(Boolean)
				)
			];

			return Promise.all(
				uniqueConsultingTypeIds.map((consultingTypeId) =>
					apiGetConsultingType({
						consultingTypeId
					})
				)
			).then((consultingTypes) =>
				agencies.map((a) => ({
					...a,
					consultingTypeRel: consultingTypes.find(
						(c) => c.id === a.consultingType
					)
				}))
			);
		});
};
