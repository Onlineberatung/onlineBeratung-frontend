import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatSubscriptionsGet = async (): Promise<any> => {
	const url = endpoints.rc.subscriptions.get;

	return fetchRCData(url, FETCH_METHODS.GET);
};
