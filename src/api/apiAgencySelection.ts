import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { AgencyDataInterface } from '../globalState/interfaces';
import { loadConsultingTypesForAgencies } from '../utils/loadConsultingTypesForAgencies';

export const apiAgencySelection = async (
	{
		fetchConsultingTypeDetails,
		...params
	}: {
		postcode?: string;
		consultingType?: number;
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

			return loadConsultingTypesForAgencies(agencies);
		});
};
