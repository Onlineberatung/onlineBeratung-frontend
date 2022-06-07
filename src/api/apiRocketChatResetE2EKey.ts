import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatResetE2EKey = async (): Promise<any> => {
	const url = `${config.endpoints.rc.users.resetE2EKey}`;

	return fetchRCData(url, FETCH_METHODS.POST);
};
