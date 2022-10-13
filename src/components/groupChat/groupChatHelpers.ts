export const isGroupChatOwner = (activeSession, userData) => {
	if (activeSession.consultant && userData) {
		return activeSession.consultant.id === userData.userId;
	} else {
		return false;
	}
};
