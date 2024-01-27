import { endpoints } from '../resources/scripts/endpoints';
import { UserDataInterface } from '../globalState/interfaces';
import { fetchData, FETCH_METHODS } from './fetchData';

export const apiGetUserData = async (
	responseHandling?: string[]
): Promise<UserDataInterface> => {
	const url = endpoints.userData;

	return fetchData({
		url: url,
		rcValidation: true,
		responseHandling,
		method: FETCH_METHODS.GET
	});
};
