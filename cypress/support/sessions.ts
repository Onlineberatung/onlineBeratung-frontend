import { v4 as uuid } from 'uuid';

export const generateSession = ({
	messagesRead
}: { messagesRead?: boolean } = {}) => {
	const sessionId = uuid();
	const rcGroupId = uuid();

	return {
		session: {
			id: sessionId,
			agencyId: 1,
			consultingType: 1,
			status: 2,
			postcode: '12345',
			groupId: rcGroupId,
			feedbackGroupId: 'feedbackGroupId1',
			askerRcId: 'askerRcId1',
			lastMessage: null,
			messageDate: null,
			messagesRead: messagesRead === undefined ? true : messagesRead,
			feedbackRead: null,
			isTeamSession: true,
			monitoring: true,
			attachment: null
		},
		chat: null,
		agency: {
			id: 1,
			name: 'agency name',
			postcode: '12345',
			city: 'city',
			description: null,
			teamAgency: true,
			offline: false,
			consultingType: 1
		},
		consultant: {
			username: 'consultant',
			absenceMessage: null,
			absent: false
		},
		ts: new Date().toISOString()
	};
};

export const generateMessage = ({
	rcGroupId,
	unread
}: { rcGroupId?: string; unread?: boolean } = {}) => {
	const id = uuid();
	return {
		id,
		alias: null,
		rid: rcGroupId,
		msg: `message id ${id}`,
		ts: new Date().toISOString(),
		u: {
			_id: 'consultant',
			username: 'consultant',
			name: null
		},
		unread: unread === undefined ? true : unread,
		_updatedAt: new Date().toISOString(),
		attachments: [],
		file: null
	};
};

export const generateMessagesReply = (messages: any[]) => {
	return {
		messages,
		count: messages.length.toString(),
		offset: '0',
		total: messages.length.toString(),
		success: 'true',
		cleaned: null
	};
};
