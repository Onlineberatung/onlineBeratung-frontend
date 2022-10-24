import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatRoomsGet = async (): Promise<any> => {
	const url = endpoints.rc.rooms.get;

	return fetchRCData(url, FETCH_METHODS.GET);
};
