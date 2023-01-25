export const MSG_CONNECT = 'connect';
export const MSG_METHOD = 'method';
export const MSG_PONG = 'pong';
export const MSG_READY = 'ready';
export const MSG_SUB = 'sub';
export const MSG_UNSUB = 'unsub';

export type MSGS =
	| typeof MSG_CONNECT
	| typeof MSG_METHOD
	| typeof MSG_PONG
	| typeof MSG_READY
	| typeof MSG_SUB
	| typeof MSG_UNSUB;

/*
METHODS
 */
export const METHOD_ARCHIVE_ROOM = 'archiveRoom';
export const METHOD_CREATE_CHANNEL = 'createChannel';
export const METHOD_CREATE_DIRECT_MESSAGE = 'createDirectMessage';
export const METHOD_CREATE_PRIVATE_GROUP = 'createPrivateGroup';
export const METHOD_DELETE_MESSAGE = 'deleteMessage';
export const METHOD_ERASE_ROOM = 'eraseRoom';
export const METHOD_E2EE_FETCH_MY_KEYS = 'e2e.fetchMyKeys';
export const METHOD_E2EE_GET_USERS_OF_ROOM_WITHOUT_KEY =
	'e2e.getUsersOfRoomWithoutKey';
export const METHOD_E2EE_SET_ROOM_KEY = 'e2e.setRoomKeyID';
export const METHOD_E2EE_SET_USER_PUBLIC_AND_PRIVATE_KEYS =
	'e2e.setUserPublicAndPivateKeys';
export const METHOD_E2EE_UPDATE_GROUP_KEY = 'e2e.updateGroupKey';
export const METHOD_TOGGLE_FAVORITE = 'toggleFavorite';
export const METHOD_PERMISSIONS_GET = 'permissions/get';
export const METHOD_PUBLIC_SETTINGS_GET = 'public-settings/get';
export const METHOD_GET_ROOM_ROLES = 'getRoomRoles';
export const METHOD_ROOMS_GET = 'rooms/get';
export const METHOD_SUBSCRIPTIONS_GET = 'subscriptions/get';
export const METHOD_GET_USER_ROLES = 'getUserRoles';
export const METHOD_GET_USERS_OF_ROOM = 'getUsersOfRoom';
export const METHOD_HIDE_ROOM = 'hideRoom';
export const METHOD_JOIN_ROOM = 'joinRoom';
export const METHOD_LEAVE_ROOM = 'leaveRoom';
export const METHOD_LIST_EMOJI_CUSTOM = 'listEmojiCustom';
export const METHOD_LOAD_HISTORY = 'loadHistory';
export const METHOD_LOGIN = 'login';
export const METHOD_STREAM_NOTIFY_ROOM = 'stream-notify-room';
export const METHOD_OPEN_ROOM = 'openRoom';
export const METHOD_PIN_MESSAGE = 'pinMessage';
export const METHOD_REGISTER_USER = 'registerUser';
export const METHOD_SAVE_ROOM_SETTINGS = 'saveRoomSettings';
export const METHOD_SEND_MESSAGE = 'sendMessage';
export const METHOD_SET_REACTION = 'setReaction';
export const METHOD_SPOTLIGHT = 'spotlight';
export const METHOD_STAR_MESSAGE = 'starMessage';
export const METHOD_UNARCHIVE_ROOM = 'unarchiveRoom';
export const METHOD_UNPIN_MESSAGE = 'unpinMessage';
export const METHOD_UPDATE_MESSAGE = 'updateMessage';
export const METHOD_USER_PRESENCE_SET_DEFAULT_STATUS =
	'UserPresence:setDefaultStatus';
export const METHOD_USER_PRESENCE_AWAY = 'UserPresence:away';

export type METHODS =
	| typeof METHOD_ARCHIVE_ROOM
	| typeof METHOD_CREATE_CHANNEL
	| typeof METHOD_CREATE_DIRECT_MESSAGE
	| typeof METHOD_CREATE_PRIVATE_GROUP
	| typeof METHOD_DELETE_MESSAGE
	| typeof METHOD_ERASE_ROOM
	| typeof METHOD_E2EE_FETCH_MY_KEYS
	| typeof METHOD_E2EE_GET_USERS_OF_ROOM_WITHOUT_KEY
	| typeof METHOD_E2EE_SET_ROOM_KEY
	| typeof METHOD_E2EE_SET_USER_PUBLIC_AND_PRIVATE_KEYS
	| typeof METHOD_E2EE_UPDATE_GROUP_KEY
	| typeof METHOD_TOGGLE_FAVORITE
	| typeof METHOD_PERMISSIONS_GET
	| typeof METHOD_PUBLIC_SETTINGS_GET
	| typeof METHOD_GET_ROOM_ROLES
	| typeof METHOD_ROOMS_GET
	| typeof METHOD_SUBSCRIPTIONS_GET
	| typeof METHOD_GET_USER_ROLES
	| typeof METHOD_GET_USERS_OF_ROOM
	| typeof METHOD_HIDE_ROOM
	| typeof METHOD_JOIN_ROOM
	| typeof METHOD_LEAVE_ROOM
	| typeof METHOD_LIST_EMOJI_CUSTOM
	| typeof METHOD_LOAD_HISTORY
	| typeof METHOD_LOGIN
	| typeof METHOD_STREAM_NOTIFY_ROOM
	| typeof METHOD_OPEN_ROOM
	| typeof METHOD_PIN_MESSAGE
	| typeof METHOD_REGISTER_USER
	| typeof METHOD_SAVE_ROOM_SETTINGS
	| typeof METHOD_SEND_MESSAGE
	| typeof METHOD_SET_REACTION
	| typeof METHOD_SPOTLIGHT
	| typeof METHOD_STAR_MESSAGE
	| typeof METHOD_UNARCHIVE_ROOM
	| typeof METHOD_UNPIN_MESSAGE
	| typeof METHOD_UPDATE_MESSAGE
	| typeof METHOD_USER_PRESENCE_SET_DEFAULT_STATUS
	| typeof METHOD_USER_PRESENCE_AWAY;

/*
LISTENERS
 */
export const LISTENER_PING = 'ping';
export const LISTENER_RESULT = 'result';
export const LISTENER_READY = 'ready';
export const LISTENER_ADDED = 'added';
export const LISTENER_CONNECTED = 'connected';
export const LISTENER_CHANGED = 'changed';
export const LISTENER_UPDATED = 'updated';
export const LISTENER_NOSUB = 'nosub';

export type LISTENERS = {
	[LISTENER_PING]?: ((res: any) => void)[];
	[LISTENER_RESULT]?: ((res: any) => void)[];
	[LISTENER_READY]?: ((res: any) => void)[];
	[LISTENER_ADDED]?: ((res: any) => void)[];
	[LISTENER_CONNECTED]?: ((res: any) => void)[];
	[LISTENER_CHANGED]?: ((res: any) => void)[];
	[LISTENER_UPDATED]?: ((res: any) => void)[];
	[LISTENER_NOSUB]?: ((res: any) => void)[];
};

/*
SUBSCRIPTIONS
 */
export const SUB_STREAM_NOTIFY_ALL = 'stream-notify-all';
export const SUB_STREAM_NOTIFY_LOGGED = 'stream-notify-logged';
export const SUB_STREAM_NOTIFY_ROOM_USERS = 'stream-notify-room-users';
export const SUB_STREAM_NOTIFY_ROOM = 'stream-notify-room';
export const SUB_STREAM_NOTIFY_USER = 'stream-notify-user';
export const SUB_STREAM_ROOM_MESSAGES = 'stream-room-messages';

export const EVENT_USERS_NAME_CHANGED = 'Users:NameChanged';
export const EVENT_USERS_DELETED = 'Users:Deleted';
export const EVENT_USER_STATUS = 'user-status';
export const EVENT_ROLES_CHANGE = 'roles-change';
export const EVENT_UPDATE_EMOJI_CUSTOM = 'updateEmojiCustom';
export const EVENT_DELETE_EMOJI_CUSTOM = 'deleteEmojiCustom';
export const EVENT_UPDATE_AVATAR = 'updateAvatar';
export const EVENT_PUBLIC_SETTINGS_CHANGED = 'public-settings-changed';
export const EVENT_PERMISSIONS_CHANGED = 'permissions-changed';
export const EVENT_WEBRTC = 'webrtc';
export const EVENT_DELETE_MESSAGE = 'deleteMessage';
export const EVENT_TYPING = 'typing';
export const EVENT_DELETE_MESSAGE_BULK = 'deleteMessageBulk';
export const EVENT_MESSAGE = 'message';
export const EVENT_OTR = 'otr';
export const EVENT_NOTIFICATION = 'notification';
export const EVENT_ROOMS_CHANGED = 'rooms-changed';
export const EVENT_SUBSCRIPTIONS_CHANGED = 'subscriptions-changed';

export type SUBSCRIPTIONS =
	| {
			name: typeof SUB_STREAM_NOTIFY_ALL;
			event:
				| typeof EVENT_ROLES_CHANGE
				| typeof EVENT_UPDATE_EMOJI_CUSTOM
				| typeof EVENT_DELETE_EMOJI_CUSTOM
				| typeof EVENT_UPDATE_AVATAR
				| typeof EVENT_PUBLIC_SETTINGS_CHANGED
				| typeof EVENT_PERMISSIONS_CHANGED;
	  }
	| {
			name: typeof SUB_STREAM_NOTIFY_LOGGED;
			event:
				| typeof EVENT_USERS_NAME_CHANGED
				| typeof EVENT_USERS_DELETED
				| typeof EVENT_UPDATE_AVATAR
				| typeof EVENT_UPDATE_EMOJI_CUSTOM
				| typeof EVENT_DELETE_EMOJI_CUSTOM
				| typeof EVENT_ROLES_CHANGE
				| typeof EVENT_USER_STATUS;
	  }
	| {
			name: typeof SUB_STREAM_NOTIFY_ROOM_USERS;
			event: typeof EVENT_WEBRTC;
			userId: string;
	  }
	| {
			name: typeof SUB_STREAM_NOTIFY_ROOM;
			event:
				| typeof EVENT_DELETE_MESSAGE
				| typeof EVENT_TYPING
				| typeof EVENT_DELETE_MESSAGE_BULK
				| typeof EVENT_WEBRTC;
			roomId: string;
	  }
	| {
			name: typeof SUB_STREAM_NOTIFY_USER;
			event:
				| typeof EVENT_MESSAGE
				| typeof EVENT_OTR
				| typeof EVENT_WEBRTC
				| typeof EVENT_NOTIFICATION
				| typeof EVENT_ROOMS_CHANGED
				| typeof EVENT_SUBSCRIPTIONS_CHANGED;
			userId: string;
	  }
	| {
			name: typeof SUB_STREAM_ROOM_MESSAGES;
			roomId: '__my_messages__' | string;
	  };

export type SUBSCRIPTION_PARAMS =
	| false
	| {
			useCollection?: boolean;
			args?: any[];
	  };
