import { v4 as uuid } from 'uuid';
import { deepMerge } from '../helpers';
export interface SocketData {
	rooms: {}[];
	subscriptions: {}[];
	roomsChanged: {};
	subscriptionsChanged: {};
	notificationMessage: {};
}

export let socketData = {
	rooms: [],
	subscriptions: [],
	roomsChanged: {},
	subscriptionsChanged: {},
	notificationMessage: {}
};

export const getSocketData = () => socketData;
export const setSocketData = (data) => (socketData = data);

export const updateSocketData = (props: { [key: string]: any }) => {
	deepMerge(socketData, props || {});
};

Cypress.Commands.add(
	'socketData',
	(props: { [key: string]: any } = {}) =>
		new Promise((resolve) => {
			updateSocketData(props);
			resolve(undefined);
		})
);

Cypress.Commands.add('getSocketData', () => {
	cy.wrap(getSocketData());
});

export const mockRooms = ({
	rooms,
	hasUnreadMessages = true,
	fixedId = false
}) =>
	rooms.map((room) => ({
		_id: fixedId ? 'AAA-BBB' : uuid(),
		name: 'name',
		fname: 'fname',
		t: 'p',
		usersCount: 3,
		u: {
			_id: 'consultant',
			username: 'consultant'
		},
		customFields: {},
		ro: false,
		_updatedAt: {
			$date: new Date().getTime()
		},
		lm: {
			$date: new Date().getTime()
		},
		lastMessage: {
			rid: fixedId
				? 'AAA-BBB'
				: room.session
				? room.session.groupId
				: room.chat.groupId,
			msg: 'enc:DWGXc8wHBQasfbAnps9UQQ==',
			org: 'enc:DWGXc8wHBQasfbAnps9UQQ==',
			alias: null,
			t: null,
			ts: {
				$date: new Date().getTime()
			},
			u: {
				_id: 'consultant',
				username: 'consultant'
			},
			unread: hasUnreadMessages,
			urls: [],
			mentions: [],
			channels: [],
			_updatedAt: {
				$date: new Date().getTime()
			},
			_id: 'lmid'
		}
	}));

export const mockSubscriptions = ({
	subscriptions,
	hasUnreadMessages = true,
	fixedId = false
}) => {
	return subscriptions.map((subscription) => ({
		_id: fixedId ? 'AAA-BBB' : uuid(),
		open: true,
		alert: true,
		unread: hasUnreadMessages ? 2 : 0,
		userMentions: 0,
		groupMentions: 0,
		ts: {
			date: new Date().getTime()
		},
		rid: fixedId
			? 'AAA-BBB'
			: subscription.session
			? subscription.session.groupId
			: subscription.chat.groupId,
		name: '2525_1588860176434',
		fname: 'mockedSubscription',
		customFields: {},
		t: 'p',
		u: {
			_id: 'consultant',
			username: 'consultant',
			name: 'consultant'
		},
		_updatedAt: {
			$date: new Date().getTime()
		},
		ls: {
			$date: new Date().getTime()
		},
		E2EKey: 'someKey'
	}));
};

export const publicSettingsGet = (id) => ({
	msg: 'result',
	id,
	result: [{}]
});

export const notificationMessageMock = ({
	userId = 'askerId1',
	rid,
	fixedId = false
}) => ({
	msg: 'changed',
	collection: 'stream-notify-user',
	id: 'id',
	fields: {
		eventName: `${userId}/notification`,
		args: [
			{
				title: '#2810_1602828954255',
				text: 'enc.nvuwo4tboruw63rnmfzwwzlsfuyq....: Encrypted message',
				payload: {
					_id: 'R7DG722j3nSX9Pptq',
					rid: fixedId ? 'AAA-BBB' : rid,
					sender: {
						_id: 'v5qk8apQFth5PJ5nS',
						username: 'enc.nvuwo4tboruw63rnmfzwwzlsfuyq....'
					},
					type: 'p',
					name: '2810_1602828954255',
					message: {
						msg: 'some encrypted Message',
						t: 'e2e'
					}
				}
			}
		]
	}
});

export const roomsChangedMessageMock = ({
	userId = 'askerId1',
	rid,
	unread = true,
	fixedId = false
}) => ({
	msg: 'changed',
	collection: 'stream-notify-user',
	id: 'id',
	fields: {
		eventName: `${userId}/rooms-changed`,
		args: [
			'updated',
			{
				_id: fixedId ? 'AAA-BBB' : rid,
				name: '2810_1602828954255',
				fname: '2810_1602828954255',
				t: 'p',
				usersCount: 3,
				u: {
					_id: 'v5qk8apQFth5PJ5nS',
					username: 'enc.nvuwo4tboruw63rnmfzwwzlsfuyq....'
				},
				customFields: {},
				ro: false,
				_updatedAt: {
					$date: new Date().getTime()
				},
				lm: {
					$date: new Date().getTime()
				},
				lastMessage: {
					rid: fixedId ? 'AAA-BBB' : rid,
					msg: 'some encrypted Message',
					org: 'some Message',
					alias: null,
					t: 'e2e',
					ts: {
						$date: new Date().getTime()
					},
					u: {
						_id: 'v5qk8apQFth5PJ5nS',
						username: 'enc.nvuwo4tboruw63rnmfzwwzlsfuyq....'
					},
					unread,
					urls: [],
					mentions: [],
					channels: [],
					_updatedAt: {
						$date: new Date().getTime()
					},
					_id: 'R7DG722j3nSX9Pptq'
				},
				e2eKeyId: 'eyJhbGciOiJB'
			}
		]
	}
});

export const subscriptionChangedMessageMock = ({
	userId = 'askerId1',
	rid,
	unread = 2,
	fixedId = false
}) => ({
	msg: 'changed',
	collection: 'stream-notify-user',
	id: 'id',
	fields: {
		eventName: `${userId}/subscriptions-changed`,
		args: [
			'updated',
			{
				_id: fixedId ? 'AAA-BBB' : rid,
				open: true,
				alert: true,
				unread,
				userMentions: 0,
				groupMentions: 0,
				ts: {
					$date: new Date().getTime()
				},
				rid: fixedId ? 'AAA-BBB' : rid,
				name: '2810_1602828954255',
				fname: '2810_1602828954255',
				t: 'p',
				u: {
					_id: `${userId}`,
					username: 'enc.nvuwo4tboruw63q.',
					name: 'Migration'
				},
				_updatedAt: {
					$date: new Date().getTime()
				},
				E2EKey: 'somekey',
				ls: {
					$date: new Date().getTime()
				}
			}
		]
	}
});
