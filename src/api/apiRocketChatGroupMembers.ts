import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';

export const apiRocketChatGroupMembers = async (rid: string): Promise<any> => {
	const url = `${endpoints.rc.groups.members}?roomId=${rid}&count=0&offset=0`;

	return fetchRCData(url, 'GET', null, true);
};
