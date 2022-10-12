import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPatchMessage = async (
	toConsultantId: string,
	status: string,
	messageId: string
): Promise<any> => {
	const url = endpoints.updateMessage + messageId;
	const data = JSON.stringify({
		toConsultantId,
		status
	});

	return fetchData({
		url: url,
		method: FETCH_METHODS.PATCH,
		bodyData: data,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
