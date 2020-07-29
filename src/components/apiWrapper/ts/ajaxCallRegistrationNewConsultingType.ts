import { config } from '../../../resources/ts/config';
import {
	fetchData,
	FETCH_METHODS,
	FETCH_ERRORS,
	FETCH_SUCCESS
} from './fetchData';

interface registrationResponse {
	sessionId: number;
}

export const ajaxCallRegistrationNewConsultingTypes = async (
	consultingType: number,
	agencyId: number,
	postcode: number
): Promise<registrationResponse> => {
	const url = config.endpoints.registerAskerNewConsultingType;
	const data = JSON.stringify({
		postcode: postcode,
		agencyId: agencyId,
		consultingType: consultingType
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: data,
		responseHandling: [FETCH_SUCCESS.CONTENT, FETCH_ERRORS.CATCH_ALL]
	});
};
