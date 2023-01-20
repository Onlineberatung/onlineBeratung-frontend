import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatUsersGetStatus = async (
	userId: string
): Promise<any> => {
	const url = `${endpoints.rc.users.getStatus}?userId=${userId}`;

	return fetchRCData(url, FETCH_METHODS.GET);
};
