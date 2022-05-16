import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatRoomsGet = async (): Promise<any> => {
	const url = config.endpoints.rc.rooms.get;

	return fetchRCData(url, FETCH_METHODS.GET);
};
