import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiSetSessionRead = async (rcGroupId: string): Promise<any> => {
	const url = endpoints.rc.subscriptions.read;
	const data = JSON.stringify({ rid: rcGroupId });

	return fetchRCData(url, FETCH_METHODS.POST, data, true);
};
