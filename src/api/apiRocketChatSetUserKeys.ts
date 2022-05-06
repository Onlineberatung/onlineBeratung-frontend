import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_ERRORS, FETCH_METHODS } from './fetchData';

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
	/*
	const req = new Request(url, {
		method: 'GET',
		headers: {
			'X-User-Id': userId,
			'X-Auth-Token': authToken,
			'cache-control': 'no-cache',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			public_key: publicKey,
			private_key: privateKey
		}),
		credentials: 'include'
	});

	const response = await fetch(req).catch((error) => {
		throw new Error(error);
	});
	if (response.status === 200) {
		return response.json();
	}

	throw new Error('apiRocketChatSetUserKeys');
 */
};
