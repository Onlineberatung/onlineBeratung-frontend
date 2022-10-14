import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatUsersInfo = async (userId: string): Promise<any> => {
	const url = `${endpoints.rc.users.info}?userId=${userId}`;

	return fetchRCData(url, FETCH_METHODS.GET);
};
