import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiSetSessionRead = async (rcGroupId: string): Promise<any> => {
	const url = config.endpoints.messageRead;
	const data = JSON.stringify({ rid: rcGroupId });

	return fetchRCData(url, FETCH_METHODS.POST, data);
};
