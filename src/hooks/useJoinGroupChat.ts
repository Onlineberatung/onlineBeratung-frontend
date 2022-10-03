import { useCallback } from 'react';
import { apiPutGroupChat, GROUP_CHAT_API } from '../api/apiPutGroupChat';
import { useTenant } from '../globalState';

export const useJoinGroupChat = () => {
	const tenantData = useTenant();

	const joinGroupChat = useCallback(
		(gcid: string) => {
			const groupChatId = parseInt(gcid);
			if (tenantData?.settings.featureGroupChatV2Enabled && groupChatId) {
				apiPutGroupChat(groupChatId, GROUP_CHAT_API.ASSIGN).then();
			}
		},
		[tenantData?.settings.featureGroupChatV2Enabled]
	);

	return {
		joinGroupChat
	};
};
