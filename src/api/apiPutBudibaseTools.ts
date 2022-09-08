import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPutBudibaseTools = async (
	userId: string,
	toolsIds: string[]
): Promise<any> => {
	return fetchData({
		bodyData: JSON.stringify(toolsIds),
		url: config.endpoints.budibaseTools(userId),
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
