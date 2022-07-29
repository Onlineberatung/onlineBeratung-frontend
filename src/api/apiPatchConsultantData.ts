import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiPatchConsultantData = async (
	consultantData: UserService.Schemas.PatchConsultantDTO
): Promise<any> => {
	const url = config.endpoints.userData;
	const bodyData = JSON.stringify(consultantData);

	return fetchData({
		bodyData: bodyData,
		url: url,
		method: FETCH_METHODS.PATCH,
		responseHandling: [FETCH_ERRORS.CONFLICT_WITH_RESPONSE]
	});
};
