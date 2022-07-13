import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatUsersInfo = async (userId: string): Promise<any> => {
	const url = `${config.endpoints.rc.users.info}?userId=${userId}`;

	return fetchRCData(url, FETCH_METHODS.GET);
};
