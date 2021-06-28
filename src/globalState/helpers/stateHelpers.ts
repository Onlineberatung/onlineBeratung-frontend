import { UserDataInterface } from '../interfaces/UserDataInterface';
import {
	SessionsDataInterface,
	SessionItemInterface,
	ListItemInterface
} from '../interfaces/SessionsDataInterface';
import {
	SESSION_TYPES,
	getChatTypeForListItem,
	getChatItemForSession,
	CHAT_TYPES
} from '../../components/session/sessionHelpers';
import { translate } from '../../utils/translate';

export const ACTIVE_SESSION = {
	CREATE_CHAT: 'CREATE_CHAT'
};

export const getActiveSession = (
	sessionGroupId: string,
	sessionsData: SessionsDataInterface
) => {
	if (!sessionsData || !sessionGroupId) {
		return null;
	}

	const getTypeByKey = (key) => {
		switch (key) {
			case 'enquiries':
				return SESSION_TYPES.ENQUIRY;
			case 'mySessions':
				return SESSION_TYPES.MY_SESSION;
			case 'teamSessions':
				return SESSION_TYPES.TEAMSESSION;
		}
		return null;
	};

	for (let key in sessionsData) {
		sessionsData[key] = sessionsData[key].map((value) => ({
			...value,
			type: getTypeByKey(key)
		}));
	}
	const allSessions = Object.keys(sessionsData)
		.map((e) => sessionsData[e])
		.reduce((a, b) => [...a, ...b]);
	const resultSessions = allSessions.filter((sessionItem) => {
		const chatItem = getChatItemForSession(sessionItem);
		return (
			(chatItem.groupId && chatItem.groupId === sessionGroupId) ||
			(chatItem.feedbackGroupId &&
				chatItem.feedbackGroupId === sessionGroupId)
		);
	});

	if (resultSessions.length) {
		const chatType = getChatTypeForListItem(resultSessions[0]);
		if (chatType !== CHAT_TYPES.GROUP_CHAT) {
			resultSessions[0].isFeedbackSession =
				resultSessions[0].session.feedbackGroupId === sessionGroupId;
		}
		return resultSessions[0];
	}

	return null;
};

export const getContact = (activeSession: ListItemInterface): any => {
	if (activeSession && activeSession.user) {
		return activeSession.user;
	}

	if (activeSession && activeSession.consultant) {
		return activeSession.consultant;
	}

	return {
		username: translate('sessionList.user.consultantUnknown')
	};
};

export const getSessionsDataKeyForSessionType = (sessionType) => {
	switch (sessionType) {
		case SESSION_TYPES.ENQUIRY:
			return 'enquiries';
		case SESSION_TYPES.MY_SESSION:
			return 'mySessions';
		case SESSION_TYPES.TEAMSESSION:
			return 'teamSessions';
		default:
			return 'mySessions';
	}
};

export const getUnreadMyMessages: Function = (sessionsData): number => {
	if (sessionsData.mySessions) {
		/* eslint-disable */
		const unreadCount = sessionsData.mySessions.filter((session) => {
			const chatType = getChatTypeForListItem(session);
			return !session[chatType].messagesRead;
		});
		/* eslint-enable */
		return unreadCount.length;
	} else {
		return 0;
	}
};

export const hasUserAuthority = (
	authority: string,
	userData: UserDataInterface
): boolean => userData.grantedAuthorities.includes(authority);

export const AUTHORITIES = {
	ANONYMOUS_DEFAULT: 'AUTHORIZATION_ANONYMOUS_DEFAULT',
	ASSIGN_CONSULTANT_TO_ENQUIRY: 'AUTHORIZATION_ASSIGN_CONSULTANT_TO_ENQUIRY',
	ASSIGN_CONSULTANT_TO_SESSION: 'AUTHORIZATION_ASSIGN_CONSULTANT_TO_SESSION',
	CONSULTANT_DEFAULT: 'AUTHORIZATION_CONSULTANT_DEFAULT',
	CREATE_NEW_CHAT: 'AUTHORIZATION_CREATE_NEW_CHAT',
	USE_FEEDBACK: 'AUTHORIZATION_USE_FEEDBACK',
	ASKER_DEFAULT: 'AUTHORIZATION_USER_DEFAULT',
	VIEW_AGENCY_CONSULTANTS: 'AUTHORIZATION_VIEW_AGENCY_CONSULTANTS',
	VIEW_ALL_FEEDBACK_SESSIONS: 'AUTHORIZATION_VIEW_ALL_FEEDBACK_SESSIONS',
	VIEW_ALL_PEER_SESSIONS: 'AUTHORIZATION_VIEW_ALL_PEER_SESSIONS'
};

export const getSessionsDataWithChangedValue = (
	sessionsData,
	activeSession,
	key,
	value
) => {
	let sesData = sessionsData,
		type = getSessionsDataKeyForSessionType(activeSession.type);
	const activeChatItem = getChatItemForSession(activeSession);
	sesData[type] = sessionsData[type].map((session) => {
		const currentChatItem = getChatItemForSession(session);
		if (currentChatItem.groupId === activeChatItem.groupId) {
			currentChatItem[key] = value;
		}
		return session;
	});

	return sesData;
};

export const isAnonymousSession = (
	session: SessionItemInterface | undefined
): boolean => {
	return session?.registrationType === 'ANONYMOUS';
};
