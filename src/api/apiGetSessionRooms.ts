import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ListItemInterface } from '../globalState';

export const apiGetSessionRooms = async (
	rcGroupIds: string[]
): Promise<{ sessions: ListItemInterface[] }> => {
	const url = `${config.endpoints.sessionRooms}?rcGroupIds=${rcGroupIds.join(
		','
	)}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};
