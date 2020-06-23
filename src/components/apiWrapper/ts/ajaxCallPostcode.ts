import { config } from '../../../resources/ts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { VALID_POSTCODE_LENGTH } from '../../postcodeSuggestion/ts/postcodeSuggestion';

export const ajaxCallPostcodeSuggestion = async (params: {
	postcode: string;
	consultingType: Number;
}): Promise<any> => {
	let queryStr = Object.keys(params)
		.map((key) => key + '=' + params[key])
		.join('&');
	const url = config.endpoints.postcode + '?' + queryStr;

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
