import { UserDataInterface } from '../interfaces/UserDataInterface';
import {
	ListItemInterface,
	REGISTRATION_TYPE_ANONYMOUS,
	SESSION_DATA_KEY_ENQUIRIES,
	SESSION_DATA_KEY_MY_SESSIONS,
	SESSION_DATA_KEY_TEAM_SESSIONS,
	SessionDataKeys,
	SessionItemInterface,
	SessionsDataInterface
} from '../interfaces/SessionsDataInterface';
import {
	CHAT_TYPE_GROUP_CHAT,
	getChatItemForSession,
	getChatTypeForListItem,
	isSessionChat,
	SESSION_LIST_TYPES
} from '../../components/session/sessionHelpers';
import { translate } from '../../utils/translate';

export type ActiveSessionType = ListItemInterface & {
	type: SESSION_LIST_TYPES;
	key: SessionDataKeys;
	isFeedbackSession?: boolean;
};

export const getActiveSession = (
	sessionGroupId?: string,
	sessionsData?: SessionsDataInterface
): ActiveSessionType | null => {
	if (!sessionsData || !sessionGroupId) {
		return null;
	}

	const getTypeByKey = (key) => {
		switch (key) {
			case SESSION_DATA_KEY_ENQUIRIES:
				return SESSION_LIST_TYPES.ENQUIRY;
			case SESSION_DATA_KEY_MY_SESSIONS:
				return SESSION_LIST_TYPES.MY_SESSION;
			case SESSION_DATA_KEY_TEAM_SESSIONS:
				return SESSION_LIST_TYPES.TEAMSESSION;
		}
		return null;
	};

	for (const key in sessionsData) {
		if (sessionsData.hasOwnProperty(key)) {
			sessionsData[key] = sessionsData[key].map(
				(value: ListItemInterface): ActiveSessionType => ({
					...value,
					type: getTypeByKey(key),
					key: key as SessionDataKeys
				})
			);
		}
	}

	const allSessions = Object.keys(sessionsData)
		.map((e): ActiveSessionType[] => sessionsData[e])
		.reduce((a, b) => [...a, ...b]);

	const resultSession = allSessions.find((sessionItem) => {
		const chatItem = getChatItemForSession(sessionItem);
		return (
			(chatItem.groupId && chatItem.groupId === sessionGroupId) ||
			(isSessionChat(chatItem) &&
				chatItem.feedbackGroupId &&
				chatItem.feedbackGroupId === sessionGroupId) ||
			(chatItem.id && chatItem.id.toString() === sessionGroupId)
		);
	});

	if (resultSession) {
		const chatType = getChatTypeForListItem(resultSession);
		if (chatType !== CHAT_TYPE_GROUP_CHAT) {
			resultSession.isFeedbackSession =
				resultSession.session.feedbackGroupId === sessionGroupId;
		}
		return resultSession;
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
		case SESSION_LIST_TYPES.ENQUIRY:
			return SESSION_DATA_KEY_ENQUIRIES;
		case SESSION_LIST_TYPES.MY_SESSION:
			return SESSION_DATA_KEY_MY_SESSIONS;
		case SESSION_LIST_TYPES.TEAMSESSION:
			return SESSION_DATA_KEY_TEAM_SESSIONS;
		default:
			return SESSION_DATA_KEY_MY_SESSIONS;
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
	ASSIGN_CONSULTANT_TO_PEER_SESSION:
		'AUTHORIZATION_ASSIGN_CONSULTANT_TO_PEER_SESSION',
	ASSIGN_CONSULTANT_TO_SESSION: 'AUTHORIZATION_ASSIGN_CONSULTANT_TO_SESSION',
	CONSULTANT_DEFAULT: 'AUTHORIZATION_CONSULTANT_DEFAULT',
	CREATE_NEW_CHAT: 'AUTHORIZATION_CREATE_NEW_CHAT',
	USE_FEEDBACK: 'AUTHORIZATION_USE_FEEDBACK',
	ASKER_DEFAULT: 'AUTHORIZATION_USER_DEFAULT',
	VIEW_AGENCY_CONSULTANTS: 'AUTHORIZATION_VIEW_AGENCY_CONSULTANTS',
	VIEW_ALL_FEEDBACK_SESSIONS: 'AUTHORIZATION_VIEW_ALL_FEEDBACK_SESSIONS',
	VIEW_ALL_PEER_SESSIONS: 'AUTHORIZATION_VIEW_ALL_PEER_SESSIONS'
};

/**
 * @deprecated Use SessionContext dispatching
 */
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
	return session?.registrationType === REGISTRATION_TYPE_ANONYMOUS;
};
