import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';
import { ServerAppConfigInterface } from '../globalState';

export const apiServerSettings = async (): Promise<ServerAppConfigInterface> =>
	fetchData({
		url: config.endpoints.serviceSettings,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: []
	});
