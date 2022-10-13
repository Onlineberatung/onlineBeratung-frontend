import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatRoomsInfo = async (roomId: string): Promise<any> => {
	const url = `${endpoints.rc.rooms.info}?roomId=${roomId}`;

	return fetchRCData(url, FETCH_METHODS.GET);
};
