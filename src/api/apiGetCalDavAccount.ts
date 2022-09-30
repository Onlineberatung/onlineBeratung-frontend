import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiHasCalDavAccount = async (): Promise<boolean> => {
	return fetchData({
		url: config.endpoints.appointmentServiceCalDavAccount,
		method: FETCH_METHODS.GET,
		skipAuth: false,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	}).then((resp) => resp.hasCalDavAccount);
};
