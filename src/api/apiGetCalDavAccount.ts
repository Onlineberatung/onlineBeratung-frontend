import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';
import { endpoints } from '../resources/scripts/endpoints';

export const apiHasCalDavAccount = async (): Promise<boolean> => {
	return fetchData({
		url: endpoints.appointmentServiceCalDavAccount,
		method: FETCH_METHODS.GET,
		skipAuth: false,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	}).then((resp) => resp.hasCalDavAccount);
};
