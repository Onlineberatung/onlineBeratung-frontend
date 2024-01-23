import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_METHODS, FETCH_SUCCESS } from './fetchData';
import { GROUP_CHAT_API } from './apiPutGroupChat';

export interface groupChatSettings {
	topic: string;
	startDate: string;
	startTime: string;
	duration: number;
	agencyId: number;
	hintMessage: string;
	repetitive: boolean;
	featureGroupChatV2Enabled?: boolean;
}

export interface chatLinkData {
	groupId: string;
}

export const apiCreateGroupChat = async (
	createChatItem: groupChatSettings
): Promise<chatLinkData> => {
	let url =
		endpoints.groupChatBase +
		(createChatItem.featureGroupChatV2Enabled
			? GROUP_CHAT_API.CREATEV2
			: GROUP_CHAT_API.CREATE);
	const chatData = JSON.stringify({ ...createChatItem });

	return fetchData({
		url: url,
		method: FETCH_METHODS.POST,
		bodyData: chatData,
		responseHandling: [FETCH_SUCCESS.CONTENT]
	});
};

export const apiUpdateGroupChat = async (
	groupChatId: number,
	createChatItem: groupChatSettings
): Promise<chatLinkData> => {
	const url = endpoints.groupChatBase + groupChatId + GROUP_CHAT_API.UPDATE;
	const chatData = JSON.stringify({ ...createChatItem });

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		bodyData: chatData,
		responseHandling: [FETCH_SUCCESS.CONTENT]
	});
};
