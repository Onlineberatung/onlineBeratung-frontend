import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { VALID_POSTCODE_LENGTH } from '../components/agencySelection/agencySelectionHelpers';
import { AgencyDataInterface } from '../globalState';

export const apiAgencySelection = async (
	params: {
		postcode: string;
		consultingType: number | undefined;
		topicId?: number;
		age?: number;
		gender?: string;
		counsellingRelation?: string;
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
		}).then((result) => {
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
		});
	} else {
		return null;
	}
};
