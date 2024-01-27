import { TSetting } from '../../api/apiRocketChatSettingsPublic';
import { IRoom } from '../../types/rc/Room';
import { ISubscriptions } from '../../types/rc/Subscriptions';

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
Status
 */
export const STATUS_OFFLINE = 'offline';
export const STATUS_ONLINE = 'online';
export const STATUS_AWAY = 'away';
export const STATUS_BUSY = 'busy';

export type Status =
	| typeof STATUS_OFFLINE
	| typeof STATUS_ONLINE
	| typeof STATUS_AWAY
	| typeof STATUS_BUSY;

type roomId = string;
type showAll = boolean;
type pagination = {
	limit: number;
	skip: number;
};
type filter = {
	[key: string]: any;
};

export type UserResponse = {
	name: string | null;
	displayName: string | null;
	status: Status;
	username: string;
	_id: string;
	_updatedAt: {
		$date: number;
	};
};

export type MethodGetUsersOfRoomRes = {
	total: number;
	records: UserResponse[];
};

export type MethodGetUserRolesRes = {
	_id: string;
	roles: string[];
	username: string;
}[];

/*
METHODS
ToDo: Explicitly define the return types of the methods
 */

export const METHOD_ARCHIVE_ROOM = 'archiveRoom';
export type MethodArchiveRoom = ((
	method: typeof METHOD_ARCHIVE_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_ARCHIVE_ROOM, params: any[]) => Promise<void>);

export const METHOD_CREATE_CHANNEL = 'createChannel';
export type MethodCreateChannel = ((
	method: typeof METHOD_CREATE_CHANNEL,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_CREATE_CHANNEL, params: any[]) => Promise<void>);

export const METHOD_CREATE_DIRECT_MESSAGE = 'createDirectMessage';
export type MethodCreateDirectMessage = ((
	method: typeof METHOD_CREATE_DIRECT_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_CREATE_DIRECT_MESSAGE,
		params: any[]
	) => Promise<void>);

export const METHOD_CREATE_PRIVATE_GROUP = 'createPrivateGroup';
export type MethodCreatePrivateGroup = ((
	method: typeof METHOD_CREATE_PRIVATE_GROUP,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_CREATE_PRIVATE_GROUP,
		params: any[]
	) => Promise<void>);

export const METHOD_DELETE_MESSAGE = 'deleteMessage';
export type MethodDeleteMessage = ((
	method: typeof METHOD_DELETE_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_DELETE_MESSAGE, params: any[]) => Promise<void>);

export const METHOD_ERASE_ROOM = 'eraseRoom';
export type MethodEraseRoom = ((
	method: typeof METHOD_ERASE_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_ERASE_ROOM, params: any[]) => Promise<void>);

export const METHOD_E2EE_FETCH_MY_KEYS = 'e2e.fetchMyKeys';
export type MethodE2eeFetchMyKeys = ((
	method: typeof METHOD_E2EE_FETCH_MY_KEYS,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_E2EE_FETCH_MY_KEYS,
		params: any[]
	) => Promise<void>);

export const METHOD_E2EE_GET_USERS_OF_ROOM_WITHOUT_KEY =
	'e2e.getUsersOfRoomWithoutKey';
export type MethodE2eeGetUsersOfRoomWithoutKey = ((
	method: typeof METHOD_E2EE_GET_USERS_OF_ROOM_WITHOUT_KEY,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_E2EE_GET_USERS_OF_ROOM_WITHOUT_KEY,
		params: any[]
	) => Promise<void>);

export const METHOD_E2EE_SET_ROOM_KEY = 'e2e.setRoomKeyID';
export type MethodE2eeSetRoomKey = ((
	method: typeof METHOD_E2EE_SET_ROOM_KEY,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_E2EE_SET_ROOM_KEY, params: any[]) => Promise<void>);

export const METHOD_E2EE_SET_USER_PUBLIC_AND_PRIVATE_KEYS =
	'e2e.setUserPublicAndPivateKeys';
export type MethodE2eeSetUserPublicAndPrivateKeys = ((
	method: typeof METHOD_E2EE_SET_USER_PUBLIC_AND_PRIVATE_KEYS,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_E2EE_SET_USER_PUBLIC_AND_PRIVATE_KEYS,
		params: any[]
	) => Promise<void>);

export const METHOD_E2EE_UPDATE_GROUP_KEY = 'e2e.updateGroupKey';
export type MethodE2eeUpdateGroupKey = ((
	method: typeof METHOD_E2EE_UPDATE_GROUP_KEY,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_E2EE_UPDATE_GROUP_KEY,
		params: any[]
	) => Promise<void>);

export const METHOD_TOGGLE_FAVORITE = 'toggleFavorite';
export type MethodToggleFavorite = ((
	method: typeof METHOD_TOGGLE_FAVORITE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_TOGGLE_FAVORITE, params: any[]) => Promise<void>);

export const METHOD_PERMISSIONS_GET = 'permissions/get';
export type MethodPermissionsGet = ((
	method: typeof METHOD_PERMISSIONS_GET,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_PERMISSIONS_GET, params: any[]) => Promise<void>);

export const METHOD_PUBLIC_SETTINGS_GET = 'public-settings/get';
export type MethodPublicSettingsGet = ((
	method: typeof METHOD_PUBLIC_SETTINGS_GET,
	params: null,
	resultListener: (res: TSetting[]) => void
) => void) &
	((
		method: typeof METHOD_PUBLIC_SETTINGS_GET,
		params: null
	) => Promise<TSetting[]>);

export const METHOD_GET_ROOM_ROLES = 'getRoomRoles';
export type MethodGetRoomRoles = ((
	method: typeof METHOD_GET_ROOM_ROLES,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_GET_ROOM_ROLES, params: any[]) => Promise<void>);

export const METHOD_ROOMS_GET = 'rooms/get';
export type MethodRoomsGet = ((
	method: typeof METHOD_ROOMS_GET,
	params: any[],
	resultListener: (res: IRoom[]) => void
) => void) &
	((method: typeof METHOD_ROOMS_GET, params: any[]) => Promise<IRoom[]>);

export const METHOD_SUBSCRIPTIONS_GET = 'subscriptions/get';
export type MethodSubscriptionsGet = ((
	method: typeof METHOD_SUBSCRIPTIONS_GET,
	params: any[],
	resultListener: (res: ISubscriptions[]) => void
) => void) &
	((
		method: typeof METHOD_SUBSCRIPTIONS_GET,
		params: any[]
	) => Promise<ISubscriptions[]>);

export const METHOD_GET_USER_ROLES = 'getUserRoles';
export type MethodGetUserRoles = ((
	method: typeof METHOD_GET_USER_ROLES,
	params: null,
	resultListener: (res: MethodGetUserRolesRes) => void
) => void) &
	((
		method: typeof METHOD_GET_USER_ROLES,
		params: null
	) => Promise<MethodGetUserRolesRes>);

export const METHOD_GET_USERS_OF_ROOM = 'getUsersOfRoom';
export type MethodGetUsersOfRoom = ((
	method: typeof METHOD_GET_USERS_OF_ROOM,
	params: [roomId, showAll, pagination?, filter?],
	resultListener: (res: MethodGetUsersOfRoomRes) => void
) => void) &
	((
		method: typeof METHOD_GET_USERS_OF_ROOM,
		params: [roomId, showAll, pagination?, filter?]
	) => Promise<MethodGetUsersOfRoomRes>);

export const METHOD_HIDE_ROOM = 'hideRoom';
export type MethodHideRoom = ((
	method: typeof METHOD_HIDE_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_HIDE_ROOM, params: any[]) => Promise<void>);

export const METHOD_JOIN_ROOM = 'joinRoom';
export type MethodJoinRoom = ((
	method: typeof METHOD_JOIN_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_JOIN_ROOM, params: any[]) => Promise<void>);

export const METHOD_LEAVE_ROOM = 'leaveRoom';
export type MethodLeaveRoom = ((
	method: typeof METHOD_LEAVE_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_LEAVE_ROOM, params: any[]) => Promise<void>);

export const METHOD_LIST_EMOJI_CUSTOM = 'listEmojiCustom';
export type MethodListEmojiCustom = ((
	method: typeof METHOD_LIST_EMOJI_CUSTOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_LIST_EMOJI_CUSTOM, params: any[]) => Promise<void>);

export const METHOD_LOAD_HISTORY = 'loadHistory';
export type MethodLoadHistory = ((
	method: typeof METHOD_LOAD_HISTORY,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_LOAD_HISTORY, params: any[]) => Promise<void>);

export const METHOD_LOGIN = 'login';
export type MethodLogin = ((
	method: typeof METHOD_LOGIN,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_LOGIN, params: any[]) => Promise<void>);

export const METHOD_STREAM_NOTIFY_ROOM = 'stream-notify-room';
export type MethodStreamNotifyRoom = ((
	method: typeof METHOD_STREAM_NOTIFY_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_STREAM_NOTIFY_ROOM,
		params: any[]
	) => Promise<void>);

export const METHOD_OPEN_ROOM = 'openRoom';
export type MethodOpenRoom = ((
	method: typeof METHOD_OPEN_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_OPEN_ROOM, params: any[]) => Promise<void>);

export const METHOD_PIN_MESSAGE = 'pinMessage';
export type MethodPinMessage = ((
	method: typeof METHOD_PIN_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_PIN_MESSAGE, params: any[]) => Promise<void>);

export const METHOD_REGISTER_USER = 'registerUser';
export type MethodRegisterUser = ((
	method: typeof METHOD_REGISTER_USER,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_REGISTER_USER, params: any[]) => Promise<void>);

export const METHOD_SAVE_ROOM_SETTINGS = 'saveRoomSettings';
export type MethodSaveRoomSettings = ((
	method: typeof METHOD_SAVE_ROOM_SETTINGS,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_SAVE_ROOM_SETTINGS,
		params: any[]
	) => Promise<void>);

export const METHOD_SEND_MESSAGE = 'sendMessage';
export type MethodSendMessage = ((
	method: typeof METHOD_SEND_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_SEND_MESSAGE, params: any[]) => Promise<void>);

export const METHOD_SET_REACTION = 'setReaction';
export type MethodSetReaction = ((
	method: typeof METHOD_SET_REACTION,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_SET_REACTION, params: any[]) => Promise<void>);

export const METHOD_SPOTLIGHT = 'spotlight';
export type MethodSpotlight = ((
	method: typeof METHOD_SPOTLIGHT,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_SPOTLIGHT, params: any[]) => Promise<void>);

export const METHOD_STAR_MESSAGE = 'starMessage';
export type MethodStarMessage = ((
	method: typeof METHOD_STAR_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_STAR_MESSAGE, params: any[]) => Promise<void>);

export const METHOD_UNARCHIVE_ROOM = 'unarchiveRoom';
export type MethodUnarchiveRoom = ((
	method: typeof METHOD_UNARCHIVE_ROOM,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_UNARCHIVE_ROOM, params: any[]) => Promise<void>);

export const METHOD_UNPIN_MESSAGE = 'unpinMessage';
export type MethodUnpinMessage = ((
	method: typeof METHOD_UNPIN_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_UNPIN_MESSAGE, params: any[]) => Promise<void>);

export const METHOD_UPDATE_MESSAGE = 'updateMessage';
export type MethodUpdateMessage = ((
	method: typeof METHOD_UPDATE_MESSAGE,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((method: typeof METHOD_UPDATE_MESSAGE, params: any[]) => Promise<void>);

export const METHOD_USER_PRESENCE_SET_DEFAULT_STATUS =
	'UserPresence:setDefaultStatus';
export type MethodUserPresenceSetDefaultStatus = ((
	method: typeof METHOD_USER_PRESENCE_SET_DEFAULT_STATUS,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_USER_PRESENCE_SET_DEFAULT_STATUS,
		params: any[]
	) => Promise<void>);

export const METHOD_USER_PRESENCE_AWAY = 'UserPresence:away';
export type MethodUserPresenceAway = ((
	method: typeof METHOD_USER_PRESENCE_AWAY,
	params: any[],
	resultListener: (res: void) => void
) => void) &
	((
		method: typeof METHOD_USER_PRESENCE_AWAY,
		params: any[]
	) => Promise<void>);

export type Methods = MethodArchiveRoom &
	MethodCreateChannel &
	MethodCreateDirectMessage &
	MethodCreatePrivateGroup &
	MethodDeleteMessage &
	MethodEraseRoom &
	MethodE2eeFetchMyKeys &
	MethodE2eeGetUsersOfRoomWithoutKey &
	MethodE2eeSetRoomKey &
	MethodE2eeSetUserPublicAndPrivateKeys &
	MethodE2eeUpdateGroupKey &
	MethodToggleFavorite &
	MethodPermissionsGet &
	MethodPublicSettingsGet &
	MethodGetRoomRoles &
	MethodRoomsGet &
	MethodSubscriptionsGet &
	MethodGetUserRoles &
	MethodGetUsersOfRoom &
	MethodHideRoom &
	MethodJoinRoom &
	MethodLeaveRoom &
	MethodListEmojiCustom &
	MethodLoadHistory &
	MethodLogin &
	MethodStreamNotifyRoom &
	MethodOpenRoom &
	MethodPinMessage &
	MethodRegisterUser &
	MethodSaveRoomSettings &
	MethodSendMessage &
	MethodSetReaction &
	MethodSpotlight &
	MethodStarMessage &
	MethodUnarchiveRoom &
	MethodUnpinMessage &
	MethodUpdateMessage &
	MethodUserPresenceSetDefaultStatus &
	MethodUserPresenceAway;

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
