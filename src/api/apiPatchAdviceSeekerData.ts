import { endpoints } from '../resources/scripts/endpoints';
import { FETCH_ERRORS, FETCH_METHODS, fetchData } from './fetchData';

export const apiPatchAdviceSeekerData = async (
	adviceSeekerData: UserService.Schemas.PatchAdviceSeekerDTO
): Promise<any> => {
	const url = endpoints.userData;
	const bodyData = JSON.stringify(adviceSeekerData);

	return fetchData({
		bodyData: bodyData,
		url: url,
		method: FETCH_METHODS.PATCH,
		responseHandling: [FETCH_ERRORS.CONFLICT_WITH_RESPONSE]
	});
};
