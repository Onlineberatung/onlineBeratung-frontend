import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatSetUserKeys = async (
	publicKey: string,
	privateKey: string
): Promise<any> => {
	const url = `${config.endpoints.rc.e2ee.setUserPublicAndPrivateKeys}`;

	return fetchRCData(
		url,
		FETCH_METHODS.POST,
		JSON.stringify({
			public_key: publicKey,
			private_key: privateKey
		})
	);
};
