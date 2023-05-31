import {
	GroupChatItemInterface,
	ListItemInterface,
	REGISTRATION_TYPE_ANONYMOUS,
	SessionItemInterface,
	STATUS_ARCHIVED,
	STATUS_EMPTY,
	STATUS_ENQUIRY
} from '../../globalState/interfaces/SessionsDataInterface';

import { MessageItem } from '../message/MessageItemComponent';
import {
	formatToDDMMYYYY,
	getPrettyDateFromMessageDate
} from '../../utils/dateHelpers';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { decodeUsername } from '../../utils/encryptionHelpers';

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

export const SESSION_TYPE_ENQUIRY = 'enquiry';
export const SESSION_TYPE_LIVECHAT = 'livechat';
export const SESSION_TYPE_ARCHIVED = 'archived';
export const SESSION_TYPE_FEEDBACK = 'feedback';
export const SESSION_TYPE_GROUP = 'group';
export const SESSION_TYPE_SESSION = 'session';
export const SESSION_TYPE_TEAMSESSION = 'teamsession';
export const SESSION_TYPE_UNKNOWN = 'unknown';

export type SESSION_TYPES =
	| typeof SESSION_TYPE_LIVECHAT
	| typeof SESSION_TYPE_ENQUIRY
	| typeof SESSION_TYPE_ARCHIVED
	| typeof SESSION_TYPE_FEEDBACK
	| typeof SESSION_TYPE_GROUP
	| typeof SESSION_TYPE_SESSION
	| typeof SESSION_TYPE_TEAMSESSION
	| typeof SESSION_TYPE_UNKNOWN;

export const getSessionType = (
	session: ListItemInterface,
	rid: string,
	uid: string
): SESSION_TYPES => {
	const chatItem = getChatItemForSession(session);
	switch (!isGroupChat(chatItem) && chatItem.status) {
		case STATUS_ENQUIRY:
		case STATUS_EMPTY:
			if (isLiveChat(chatItem)) {
				return SESSION_TYPE_LIVECHAT;
			}
			return SESSION_TYPE_ENQUIRY;
		case STATUS_ARCHIVED:
			return SESSION_TYPE_ARCHIVED;
	}

	if (!isGroupChat(chatItem) && chatItem?.feedbackGroupId === rid) {
		return SESSION_TYPE_FEEDBACK;
	} else if (isGroupChat(chatItem)) {
		return SESSION_TYPE_GROUP;
	}

	if (isTeamSession(chatItem) && session?.consultant?.id !== uid) {
		return SESSION_TYPE_TEAMSESSION;
	}

	return SESSION_TYPE_SESSION;
};

export const getChatTypeForListItem = (
	listItem?: ListItemInterface
): ChatTypes =>
	listItem && listItem.chat ? CHAT_TYPE_GROUP_CHAT : CHAT_TYPE_SINGLE_CHAT;

export const isSessionChat = (
	chatItem: SessionItemInterface | GroupChatItemInterface
): chatItem is SessionItemInterface => {
	return chatItem && 'feedbackGroupId' in chatItem;
};

export const isLiveChat = (
	chatItem: SessionItemInterface | GroupChatItemInterface
): chatItem is SessionItemInterface => {
	return (
		isSessionChat(chatItem) &&
		chatItem.registrationType === REGISTRATION_TYPE_ANONYMOUS
	);
};

export const isGroupChat = (
	chatItem: SessionItemInterface | GroupChatItemInterface
): chatItem is GroupChatItemInterface => {
	return (
		(chatItem as GroupChatItemInterface) && !('feedbackGroupId' in chatItem)
	);
};

export const isTeamSession = (
	sessionItem: SessionItemInterface
): sessionItem is SessionItemInterface => {
	return sessionItem && sessionItem.isTeamSession;
};

export const getChatItemForSession = (
	sessionItem?: ListItemInterface
): GroupChatItemInterface | SessionItemInterface | null => {
	if (!sessionItem) {
		return null;
	}
	const chatType = getChatTypeForListItem(sessionItem);
	if (chatType === CHAT_TYPE_GROUP_CHAT) {
		return sessionItem[chatType] as GroupChatItemInterface;
	}
	return sessionItem[chatType] as SessionItemInterface;
};

export const SESSION_LIST_TAB_ANONYMOUS = 'anonymous';
export const SESSION_LIST_TAB_ARCHIVE = 'archive';

export type SESSION_LIST_TAB =
	| typeof SESSION_LIST_TAB_ANONYMOUS
	| typeof SESSION_LIST_TAB_ARCHIVE;

export const getViewPathForType = (type: SESSION_LIST_TYPES) => {
	if (type === SESSION_LIST_TYPES.ENQUIRY) {
		return 'sessionPreview';
	} else if (type === SESSION_LIST_TYPES.MY_SESSION) {
		return 'sessionView';
	} else if (type === SESSION_LIST_TYPES.TEAMSESSION) {
		return 'teamSessionView';
	}
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
	const findLastVideoCallIndex = (messagesData as any).findLastIndex(
		(message) => message?.alias?.messageType === 'VIDEOCALL'
	);
	return [...messagesData].map((message, i) => {
		const date = new Date(message.ts).getTime();
		const dateFormated = formatToDDMMYYYY(date);
		let lastDateStr = { str: '', date: null };

		if (lastDate !== dateFormated) {
			lastDate = dateFormated;
			lastDateStr = getPrettyDateFromMessageDate(date / 1000);
		}

		return {
			_id: message._id,
			message: message.msg,
			messageDate: lastDateStr,
			messageTime: date.toString(),
			username: message.u.username,
			displayName: selectDisplayName(message.u),
			userId: message.u._id,
			isNotRead: message.unread,
			alias: message.alias,
			attachments: message.attachments,
			file: message.file,
			t: message.t,
			rid: message.rid,
			isVideoActive: i === findLastVideoCallIndex
		};
	});
};

export const selectDisplayName = (userObject) => {
	if (`${userObject.username}`.toLowerCase() === 'system')
		return userObject.username;
	if (userObject.name === null) return userObject.username;
	if (userObject.name !== null) return decodeUsername(userObject.name);

	return userObject.username;
};

export const isMyMessage = (id: string): boolean =>
	id === getValueFromCookie('rc_uid');

export const isUserModerator = ({ chatItem, rcUserId }) =>
	isGroupChat(chatItem) &&
	chatItem.moderators &&
	chatItem.moderators.includes(rcUserId);
