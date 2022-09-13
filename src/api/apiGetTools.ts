import { APIToolsInterface } from '../globalState/interfaces/ToolsInterface';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiGetTools = async (
	userId: string
): Promise<APIToolsInterface[]> => {
	return fetchData({
		url: config.endpoints.budibaseTools(userId),
		method: FETCH_METHODS.GET,
		skipAuth: false,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
};

export const userHasBudibaseTools = async (
	userId: string
): Promise<boolean> => {
	return fetchData({
		url: config.endpoints.budibaseTools(userId),
		method: FETCH_METHODS.GET,
		skipAuth: false,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	}).then((resp) => {
		const toolsShared = resp.filter((tool) => tool.sharedWithAdviceSeeker);
		return toolsShared.length > 0;
	});
};
