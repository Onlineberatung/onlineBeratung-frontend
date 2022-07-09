import { config } from '../resources/scripts/config';
import { fetchRCData } from './fetchRCData';
import { FETCH_METHODS } from './fetchData';

export const apiRocketChatSettingsPublic = async (
	settingsEntries: string[] = null
): Promise<any> => {
	const url = config.endpoints.rc.settings.public;
	const query = settingsEntries
		? '?query=' + JSON.stringify({ _id: { $in: settingsEntries } })
		: '';
	return fetchRCData(url + query, FETCH_METHODS.GET);
};
