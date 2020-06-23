import { config } from '../../../resources/ts/config';
import { UserDataInterface } from '../../../globalState';
import { fetchData, FETCH_METHODS } from './fetchData';

export const getUserData = async (): Promise<UserDataInterface> => {
	const url = config.endpoints.userData;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET
	});
};
