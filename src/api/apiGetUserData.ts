import { config } from '../resources/scripts/config';
import { UserDataInterface } from '../globalState';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetUserData = async (): Promise<UserDataInterface> => {
	const url = config.endpoints.userData;

	return fetchData({
		url: url,
		rcValidation: true,
		method: FETCH_METHODS.GET
	});
};
