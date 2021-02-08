import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { VALID_POSTCODE_LENGTH } from '../components/agencySelection/agencySelectionHelpers';
import { AgencyDataInterface } from '../globalState';

export const apiAgencySelection = async (params: {
	postcode: string;
	consultingType: number | undefined;
}): Promise<[AgencyDataInterface] | null> => {
	let queryStr = Object.keys(params)
		.map((key) => key + '=' + params[key])
		.join('&');
	const url = config.endpoints.agencyServiceBase + '?' + queryStr;

	if (params.postcode.length === VALID_POSTCODE_LENGTH) {
		return fetchData({
			url: url,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_ERRORS.EMPTY]
		});
	} else {
		return null;
	}
};
