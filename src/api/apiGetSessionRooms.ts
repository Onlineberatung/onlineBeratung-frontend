import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ListItemInterface } from '../globalState/interfaces';

export const apiGetSessionRoomsByGroupIds = async (
	rcGroupIds: string[],
	signal?: AbortSignal
): Promise<{ sessions: ListItemInterface[] }> => {
	const url = `${endpoints.sessionRooms}?rcGroupIds=${rcGroupIds.join(',')}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.CATCH_ALL],
		...(signal && { signal: signal })
	});
};

export const apiGetSessionRoomBySessionId = async (
	sessionId: number,
	signal?: AbortSignal
): Promise<{ sessions: ListItemInterface[] }> => {
	const url = `${endpoints.sessionRooms}/${sessionId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY, FETCH_ERRORS.FORBIDDEN],
		...(signal && { signal: signal })
	});
};
