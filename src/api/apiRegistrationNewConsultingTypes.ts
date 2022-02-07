import { config } from '../resources/scripts/config';
import {
	fetchData,
	FETCH_METHODS,
	FETCH_ERRORS,
	FETCH_SUCCESS
} from './fetchData';

interface registrationResponse {
	sessionId: number;
}

export const apiRegistrationNewConsultingTypes = async (
	consultingType: number,
	agencyId: number,
	postcode: string,
	consultantId?: string
): Promise<registrationResponse> => {
	const url = config.endpoints.registerAskerNewConsultingType;
	const data = JSON.stringify({
		postcode,
		agencyId,
		consultingType,
		consultantId
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		rcValidation: true,
		bodyData: data,
		responseHandling: [
			FETCH_SUCCESS.CONTENT,
			FETCH_ERRORS.CATCH_ALL,
			FETCH_ERRORS.CONFLICT_WITH_RESPONSE
		]
	});
};
