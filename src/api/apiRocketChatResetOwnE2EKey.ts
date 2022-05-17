import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatResetOwnE2EKey = async (): Promise<any> => {
	const url = `${config.endpoints.rc.e2ee.resetOwnE2EKey}`;

	throw new Error(
		'This function is not implemented as api endpoint in rocket.chat'
	);
	return fetchRCData(url, FETCH_METHODS.GET);
};
