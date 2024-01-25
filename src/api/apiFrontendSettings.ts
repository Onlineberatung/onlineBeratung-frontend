import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';
import { AppConfigInterface } from '../globalState';

export const apiFrontendSettings = async (): Promise<AppConfigInterface> =>
	fetchData({
		url: endpoints.frontend.settings,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: []
	});
