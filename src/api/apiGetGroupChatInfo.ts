import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { config } from '../resources/scripts/config';
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
	const rcToken = getValueFromCookie('rc_token');
	let url = config.endpoints.groupChatBase + groupChatId;
	if (rcToken) {
		url = url + '?chatUserToken=' + rcToken;
	}

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		responseHandling: [FETCH_SUCCESS.CONTENT, FETCH_ERRORS.NO_MATCH]
	});
};
