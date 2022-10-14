/**
 * Returns all users of the room who have no key for the romm generated
 */
import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';

export const apiRocketChatGetUsersOfRoomWithoutKey = async (
	rid: string
): Promise<any> => {
	const url = `${endpoints.rc.e2ee.getUsersOfRoomWithoutKey}?rid=${rid}`;

	return fetchRCData(url, 'GET', null, true);
};
