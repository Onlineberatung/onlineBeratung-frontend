import { endpoints } from '../resources/scripts/endpoints';
import { FETCH_METHODS } from './fetchData';
import { fetchRCData } from './fetchRCData';

export const apiRocketchatLogout = async (): Promise<any> => {
	const url = endpoints.rc.logout;

	return fetchRCData(url, FETCH_METHODS.POST);
};
