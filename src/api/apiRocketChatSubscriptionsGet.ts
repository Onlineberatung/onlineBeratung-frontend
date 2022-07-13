import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatSubscriptionsGet = async (): Promise<any> => {
	const url = config.endpoints.rc.subscriptions.get;

	return fetchRCData(url, FETCH_METHODS.GET);
};
