import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS } from './fetchData';
import { ServerAppConfigInterface } from '../globalState/interfaces';

export const apiServerSettings = async (): Promise<ServerAppConfigInterface> =>
	fetchData({
		url: endpoints.serviceSettings,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: []
	});
