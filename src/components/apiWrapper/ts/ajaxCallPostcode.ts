import { config } from '../../../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { VALID_POSTCODE_LENGTH } from '../../agencySelection/agencySelectionHelper';
import { AgencyDataInterface } from '../../../globalState';

export const ajaxCallAgencySelection = async (params: {
	postcode: string;
	consultingType: number | undefined;
}): Promise<[AgencyDataInterface] | null> => {
	let queryStr = Object.keys(params)
		.map((key) => key + '=' + params[key])
		.join('&');
	const url = config.endpoints.agencyServiceBase + '?' + queryStr;

	if (params.postcode.length >= VALID_POSTCODE_LENGTH.SHORT) {
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
