import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatUpdateGroupKey = async (
	uid: string,
	rid: string,
	key: string
): Promise<any> => {
	const url = `${endpoints.rc.e2ee.updateGroupKey}`;

	return fetchRCData(
		url,
		FETCH_METHODS.POST,
		JSON.stringify({
			uid,
			rid,
			key
		})
	);
};
