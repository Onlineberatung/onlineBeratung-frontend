import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';

export const apiRocketChatGroupMembers = async (rid: string): Promise<any> => {
	const url = `${config.endpoints.rc.groups.members}?roomId=${rid}`;

	return fetchRCData(url, 'GET');
};
