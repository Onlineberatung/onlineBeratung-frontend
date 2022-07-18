/**
 * Returns all users of the room who have no key for the romm generated
 */
import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';

export const apiRocketChatGetUsersOfRoomWithoutKey = async (
	rid: string
): Promise<any> => {
	const url = `${config.endpoints.rc.e2ee.getUsersOfRoomWithoutKey}?rid=${rid}`;

	return fetchRCData(url, 'GET', null, true);
};
