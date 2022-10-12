import { endpoints } from '../resources/scripts/endpoints';
import { fetchRCData } from './fetchRCData';

type FetchMyKeysResponse = {
	success: boolean;
	private_key?: string;
	public_key?: string;
};

export const apiRocketChatFetchMyKeys =
	async (): Promise<FetchMyKeysResponse> => {
		const url = endpoints.rc.e2ee.fetchMyKeys;

		return fetchRCData(url, 'GET');
	};
