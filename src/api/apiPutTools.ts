import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiPutTools = async (
	userId: string,
	toolsIds: string[]
): Promise<any> => {
	return fetchData({
		bodyData: JSON.stringify(toolsIds),
		url: endpoints.budibaseTools(userId),
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST]
	});
};
