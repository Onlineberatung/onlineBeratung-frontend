import { config } from '../../../resources/ts/config';
import { FETCH_METHODS } from './fetchData';
import { fetchRCData } from './fetchRCData';

export const rocketchatLogout = async (): Promise<any> => {
	const url = config.endpoints.rocketchatLogout;

	return fetchRCData(url, FETCH_METHODS.POST);
};
