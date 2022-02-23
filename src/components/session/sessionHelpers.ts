import {
	GroupChatItemInterface,
	ListItemInterface,
	LiveChatInterface,
	REGISTRATION_TYPE_ANONYMOUS,
	SESSION_DATA_KEY_ENQUIRIES,
	SESSION_DATA_KEY_MY_SESSIONS,
	SESSION_DATA_KEY_TEAM_SESSIONS,
	SessionDataKeys,
	SessionItemInterface
} from '../../globalState/interfaces/SessionsDataInterface';

import { MessageItem } from '../message/MessageItemComponent';
import {
	formatToDDMMYYYY,
	getPrettyDateFromMessageDate
} from '../../utils/dateHelpers';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';

export enum SESSION_LIST_TYPES {
	ENQUIRY = 'ENQUIRY',
	MY_SESSION = 'MY_SESSION',
	TEAMSESSION = 'TEAMSESSION'
}

export const CHAT_TYPE_GROUP_CHAT = 'chat';
export const CHAT_TYPE_SINGLE_CHAT = 'session';

export type ChatTypes =
	| typeof CHAT_TYPE_GROUP_CHAT
	| typeof CHAT_TYPE_SINGLE_CHAT;

export const CHAT_TYPES: ChatTypes[] = [
	CHAT_TYPE_GROUP_CHAT,
	CHAT_TYPE_SINGLE_CHAT
];

export const getSessionDataKeyForSessionListType = (
	type: SESSION_LIST_TYPES
): SessionDataKeys => {
	switch (type) {
		case SESSION_LIST_TYPES.ENQUIRY:
			return SESSION_DATA_KEY_ENQUIRIES;
		case SESSION_LIST_TYPES.TEAMSESSION:
			return SESSION_DATA_KEY_TEAM_SESSIONS;
		case SESSION_LIST_TYPES.MY_SESSION:
			return SESSION_DATA_KEY_MY_SESSIONS;
	}
};

export const getChatTypeForListItem = (
	listItem?: ListItemInterface
): ChatTypes =>
	listItem && listItem.chat ? CHAT_TYPE_GROUP_CHAT : CHAT_TYPE_SINGLE_CHAT;

export const isSessionChat = (
	chatItem: SessionItemInterface | GroupChatItemInterface | LiveChatInterface
): chatItem is SessionItemInterface | LiveChatInterface => {
	return chatItem && 'feedbackGroupId' in chatItem;
};

export const isLiveChat = (
	chatItem: SessionItemInterface | GroupChatItemInterface | LiveChatInterface
): chatItem is LiveChatInterface => {
	return (
		isSessionChat(chatItem) &&
		chatItem.registrationType === REGISTRATION_TYPE_ANONYMOUS
	);
};

export const isGroupChat = (
	chatItem: SessionItemInterface | GroupChatItemInterface | LiveChatInterface
): chatItem is GroupChatItemInterface => {
	return chatItem && !('feedbackGroupId' in chatItem);
};

export const getChatItemForSession = (
	sessionItem?: ListItemInterface
): GroupChatItemInterface | SessionItemInterface | LiveChatInterface | null => {
	if (!sessionItem) {
		return null;
	}
	const chatType = getChatTypeForListItem(sessionItem);
	return sessionItem[chatType];
};

export const isGroupChatForSessionItem = (sessionItem: ListItemInterface) => {
	return getChatTypeForListItem(sessionItem) === CHAT_TYPE_GROUP_CHAT;
};

export const getGroupIdFromSessionItem = (item: any) => item.messages[0].rid;

export const typeIsSession = (type: SESSION_LIST_TYPES) =>
	type === SESSION_LIST_TYPES.MY_SESSION;
export const typeIsTeamSession = (type: SESSION_LIST_TYPES) =>
	type === SESSION_LIST_TYPES.TEAMSESSION;
export const typeIsEnquiry = (type: SESSION_LIST_TYPES) =>
	type === SESSION_LIST_TYPES.ENQUIRY;

export const SESSION_LIST_TAB = {
	ANONYMOUS: 'anonymous',
	REGISTERED: 'registered',
	ARCHIVE: 'archive'
};

export const isAnonymousSessionListTab = (currentTab: string): boolean =>
	currentTab === SESSION_LIST_TAB.ANONYMOUS;

export const getViewPathForType = (type: SESSION_LIST_TYPES) => {
	if (type === SESSION_LIST_TYPES.ENQUIRY) {
		return 'sessionPreview';
	} else if (type === SESSION_LIST_TYPES.MY_SESSION) {
		return 'sessionView';
	} else if (type === SESSION_LIST_TYPES.TEAMSESSION) {
		return 'teamSessionView';
	}
};

export const initialScrollDown = () => {
	const session = document.querySelector('.session__content');
	session.scrollTop = session.scrollHeight;
};

export const getTypeOfLocation = () => {
	const type = ((path) => {
		if (path.indexOf('sessionPreview') !== -1) {
			return SESSION_LIST_TYPES.ENQUIRY;
		} else if (path.indexOf('sessionView') !== -1) {
			return SESSION_LIST_TYPES.MY_SESSION;
		} else if (path.indexOf('teamSessionView') !== -1) {
			return SESSION_LIST_TYPES.TEAMSESSION;
		} else {
			return null;
		}
	})(window.location.pathname);
	return type;
};

export const getSessionListPathForLocation = () => {
	const type = getTypeOfLocation();
	let sessionListPath;
	if (typeIsSession(type)) {
		sessionListPath = 'consultant/sessionView';
	} else if (typeIsTeamSession(type)) {
		sessionListPath = 'consultant/teamSessionView';
	} else if (typeIsEnquiry(type)) {
		sessionListPath = 'consultant/sessionPreview';
	} else {
		sessionListPath = 'user/view';
	}
	return `/sessions/${sessionListPath}`;
};

export const scrollToEnd = (timeout: number, animation: boolean = false) => {
	setTimeout(() => {
		const container = document.querySelector('#session-scroll-container');
		const currentHeight = container ? container.scrollHeight : 0;
		const PADDING = 200;
		if (animation) {
			const startTop = container ? container.scrollTop : 0;
			let delta = 0;
			const distance = currentHeight + PADDING - startTop;
			const steps = distance / 20;

			const fpsInterval = 1000 / 60;
			let next = Date.now();
			const loop = () => {
				const now = Date.now();
				if (now - next > fpsInterval) {
					next = now - ((now - next) % fpsInterval);
					delta += steps;
					if (container) {
						container.scrollTo(0, startTop + delta);
					}
				}
				if (delta < distance) {
					requestAnimationFrame(loop);
				}
			};
			loop();
		} else if (container) {
			container.scrollTo(0, currentHeight + PADDING);
		}
	}, timeout);
};

export const prepareMessages = (messagesData): MessageItem[] => {
	let lastDate = '';

	return [...messagesData].map((message) => {
		const date = new Date(message.ts).getTime();
		const dateFormated = formatToDDMMYYYY(date);
		let lastDateStr = '';

		if (lastDate !== dateFormated) {
			lastDate = dateFormated;
			lastDateStr = getPrettyDateFromMessageDate(date / 1000);
		}

		return {
			message: message.msg,
			messageDate: lastDateStr,
			messageTime: date.toString(),
			username: message.u.username,
			userId: message.u._id,
			isNotRead: message.unread,
			alias: message.alias,
			attachments: message.attachments,
			file: message.file
		};
	});
};

export const isMyMessage = (id: string): boolean =>
	id === getValueFromCookie('rc_uid');
