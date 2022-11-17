import { useCallback } from 'react';
import { apiPutGroupChat, GROUP_CHAT_API } from '../api/apiPutGroupChat';
import { useTenant } from '../globalState';

export const useJoinGroupChat = () => {
	const tenantData = useTenant();

	const joinGroupChat = useCallback(
		(gcid: string) => {
			if (tenantData?.settings.featureGroupChatV2Enabled && gcid) {
				apiPutGroupChat(gcid, GROUP_CHAT_API.ASSIGN).then();
			}
		},
		[tenantData?.settings.featureGroupChatV2Enabled]
	);

	return {
		joinGroupChat
	};
};
