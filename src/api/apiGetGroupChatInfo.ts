import { endpoints } from '../resources/scripts/endpoints';
import {
	fetchData,
	FETCH_METHODS,
	FETCH_SUCCESS,
	FETCH_ERRORS
} from './fetchData';

export interface groupChatInfoData {
	active: boolean;
	groupId: string;
	id: number;
	bannedUsers?: string[];
}

export const apiGetGroupChatInfo = async (
	groupChatId: number
): Promise<groupChatInfoData> => {
	const url = endpoints.groupChatBase + groupChatId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_SUCCESS.CONTENT, FETCH_ERRORS.NO_MATCH],
		rcValidation: true
	});
};
