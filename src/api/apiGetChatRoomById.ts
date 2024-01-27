import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { ListItemInterface } from '../globalState/interfaces';

export const apiGetChatRoomById = async (
	chatId: number,
	signal?: AbortSignal
): Promise<{ sessions: ListItemInterface[] }> => {
	const url = `${endpoints.chatRoom}/${chatId}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY],
		...(signal && { signal: signal })
	});
};
