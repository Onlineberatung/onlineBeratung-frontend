import {
	GroupChatItemInterface,
	ListItemInterface,
	REGISTRATION_TYPE_ANONYMOUS,
	SessionItemInterface,
	STATUS_ARCHIVED,
	STATUS_EMPTY,
	STATUS_ENQUIRY
} from '../../globalState/interfaces/SessionsDataInterface';

import { getPrettyDateFromMessageDate } from '../../utils/dateHelpers';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import {
	decodeUsername,
	decryptText,
	MissingKeyError
} from '../../utils/encryptionHelpers';
import { MessageItem } from '../../types/MessageItem';
import { ERROR_LEVEL_WARN, TError } from '../../api/apiPostError';
import { markdownToDraft } from 'markdown-draft-js';
import {
	markdownToDraftDefaultOptions,
	sanitizeHtmlDefaultOptions,
	urlifyLinksInText
} from '../messageSubmitInterface/richtextHelpers';
import { ContentState, convertFromRaw } from 'draft-js';
import sanitizeHtml from 'sanitize-html';
import { stateToHTML } from 'draft-js-export-html';
import i18n from '../../i18n';

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

export const scrollToEnd = (
	container,
	timeout: number,
	animation: boolean = false
) => {
	setTimeout(() => {
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

export const prepareMessage = (message): MessageItem => {
	if (!message) {
		return message;
	}

	const date = new Date(message.ts).getTime();

	return {
		_id: message._id,
		message: message.msg,
		messageDate: getPrettyDateFromMessageDate(date / 1000),
		messageTime: date.toString(),
		username: message.u.username,
		displayName: selectDisplayName(message.u),
		userId: message.u._id,
		unread: message.unread,
		alias: message.alias,
		attachments: message.attachments,
		file: message.file,
		t: message.t,
		rid: message.rid,
		own: message.u._id === getValueFromCookie('rc_uid')
	};
};

export const decryptMessage = (
	message: MessageItem,
	keyID: string,
	key: CryptoKey,
	encrypted: boolean,
	handleDecryptionErrors: (
		id: string,
		messageTime: string,
		error: TError
	) => void,
	handleDecryptionSuccess: (id: string) => void
) => {
	if (!message || !message.message) {
		return message;
	}

	return decryptText(
		message.message,
		keyID,
		key,
		encrypted,
		message.t === 'e2e'
	)
		.catch((e) => {
			if (!(e instanceof MissingKeyError)) {
				handleDecryptionErrors(message._id, message.messageTime, {
					name: e.name,
					message: e.message,
					stack: e.stack,
					level: ERROR_LEVEL_WARN
				});
			}

			return i18n.t('e2ee.message.encryption.text');
		})
		.then((decryptedMessage) => {
			handleDecryptionSuccess(message._id);
			return {
				...message,
				message: decryptedMessage
			};
		});
};

export const parseMessage = (message: MessageItem) => {
	if (!message || !message.message) {
		return message;
	}

	const rawMessageObject = markdownToDraft(
		message.message,
		markdownToDraftDefaultOptions
	);
	const contentStateMessage: ContentState = convertFromRaw(rawMessageObject);

	return {
		...message,
		parsedMessage: contentStateMessage.hasText()
			? sanitizeHtml(
					urlifyLinksInText(stateToHTML(contentStateMessage)),
					sanitizeHtmlDefaultOptions
			  )
			: ''
	};
};

export const selectDisplayName = (userObject) => {
	if (`${userObject.username}`.toLowerCase() === 'system')
		return userObject.username;
	if (userObject.name === null) return userObject.username;
	return decodeUsername(userObject.name);
};

export const isUserModerator = ({ chatItem, rcUserId }) =>
	isGroupChat(chatItem) &&
	chatItem.moderators &&
	chatItem.moderators.includes(rcUserId);
