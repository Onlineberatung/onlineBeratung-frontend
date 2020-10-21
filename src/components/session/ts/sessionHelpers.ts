import { ListItemInterface } from '../../../globalState';
import { MessageItem } from '../../message/ts/MessageItemComponent';
import {
	formatToDDMMYYYY,
	getPrettyDateFromMessageDate
} from '../../../resources/ts/helpers/dateHelpers';
import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';

export const SESSION_TYPES = {
	ENQUIRY: 'ENQUIRY',
	MY_SESSION: 'MY_SESSION',
	TEAMSESSION: 'TEAMSESSION',
	USER: 'USER'
};

export const CHAT_TYPES = {
	GROUP_CHAT: 'chat',
	SINGLE_CHAT: 'session'
};

export const getChatTypeForListItem = (listItem: ListItemInterface): string =>
	listItem && listItem.chat ? CHAT_TYPES.GROUP_CHAT : CHAT_TYPES.SINGLE_CHAT;
export const getChatItemForSession = (sessionItem: ListItemInterface) => {
	if (!sessionItem) {
		return null;
	}
	const chatType = getChatTypeForListItem(sessionItem);
	return sessionItem[chatType];
};
export const isGroupChatForSessionItem = (sessionItem: ListItemInterface) => {
	return getChatTypeForListItem(sessionItem) === CHAT_TYPES.GROUP_CHAT;
};

export const getGroupIdFromSessionItem = (item: any) => item.messages[0].rid;

export const typeIsSession = (type: string) =>
	type === SESSION_TYPES.MY_SESSION;
export const typeIsTeamSession = (type: string) =>
	type === SESSION_TYPES.TEAMSESSION;
export const typeIsUser = (type: string) => type === SESSION_TYPES.USER;
export const typeIsEnquiry = (type: string) => type === SESSION_TYPES.ENQUIRY;

export const getViewPathForType = (type: string) => {
	if (type === SESSION_TYPES.ENQUIRY) {
		return 'sessionPreview';
	} else if (type === SESSION_TYPES.MY_SESSION) {
		return 'sessionView';
	} else if (type === SESSION_TYPES.TEAMSESSION) {
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
			return SESSION_TYPES.ENQUIRY;
		} else if (path.indexOf('sessionView') !== -1) {
			return SESSION_TYPES.MY_SESSION;
		} else if (path.indexOf('teamSessionView') !== -1) {
			return SESSION_TYPES.TEAMSESSION;
		} else if (path.indexOf('user') !== -1) {
			return SESSION_TYPES.USER;
		} else {
			return SESSION_TYPES.MY_SESSION;
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
	} else if (typeIsUser(type)) {
		sessionListPath = 'user/view';
	} else {
		sessionListPath = 'consultant/sessionPreview';
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

export const isMyMessage = (id: string) => id === getTokenFromCookie('rc_uid');
