import { config } from '../resources/scripts/config';
import { FETCH_METHODS } from './fetchData';
import { fetchRCData } from './fetchRCData';

export const apiRocketchatLogout = async (): Promise<any> => {
	const url = config.endpoints.rc.logout;

	return fetchRCData(url, FETCH_METHODS.POST);
};
