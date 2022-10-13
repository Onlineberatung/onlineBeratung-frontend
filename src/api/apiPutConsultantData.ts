import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const apiPutConsultantData = async (
	consultantData: UserService.Schemas.UpdateConsultantDTO
): Promise<any> => {
	const url = endpoints.userData;
	const bodyData = JSON.stringify(consultantData);

	return fetchData({
		bodyData: bodyData,
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [
			FETCH_ERRORS.CONFLICT_WITH_RESPONSE,
			FETCH_ERRORS.BAD_REQUEST
		]
	});
};
