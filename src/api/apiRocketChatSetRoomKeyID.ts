import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatSetRoomKeyID = async (
	rid: string,
	keyID: string
): Promise<any> => {
	const url = `${config.endpoints.rc.e2ee.setRoomKeyID}`;

	return fetchRCData(
		url,
		FETCH_METHODS.POST,
		JSON.stringify({
			rid,
			keyID
		})
	);
};
