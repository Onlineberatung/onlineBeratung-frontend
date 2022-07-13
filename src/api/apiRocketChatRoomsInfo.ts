import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatRoomsInfo = async (roomId: string): Promise<any> => {
	const url = `${config.endpoints.rc.rooms.info}?roomId=${roomId}`;

	return fetchRCData(url, FETCH_METHODS.GET);
};
