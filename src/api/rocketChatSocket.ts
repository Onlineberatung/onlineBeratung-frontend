import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { decodeUsername } from '../utils/encryptionHelpers';
import { apiUrl } from '../resources/scripts/config';

const SOCKET_STATUS = {
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3
};

export const SOCKET_COLLECTION = {
	NOTIFY_USER: 'stream-notify-user',
	ROOM_MESSAGES: 'stream-room-messages',
	NOTIFY_ROOM: 'stream-notify-room'
};

export class rocketChatSocket {
	private rcUid = '';
	private rcWebsocket: WebSocket | null = null;
	private subscriptions: Object[] = [];
	private messageListeners: Function[] = [];

	constructor() {
		this.rcUid = getValueFromCookie('rc_uid');
		this.rcWebsocket = null;
	}

	private getEndpoint() {
		const host = window.location.hostname;
		if (apiUrl) {
			return `${apiUrl
				.replace('http://', 'ws://')
				.replace('https://', 'wss://')}/websocket`;
		}
		return `wss://${host}/websocket`;
	}

	public connect() {
		const rcAuthToken = getValueFromCookie('rc_token');
		this.rcWebsocket = new WebSocket(this.getEndpoint());

		this.rcWebsocket.addEventListener('open', () => {
			if (this.rcWebsocket?.readyState === SOCKET_STATUS.OPEN) {
				// connect
				this.rcWebsocket.send(
					JSON.stringify({
						msg: 'connect',
						version: '1',
						support: ['1']
					})
				);
				// login
				this.rcWebsocket.send(
					JSON.stringify({
						msg: 'method',
						method: 'login',
						id: this.rcUid,
						params: [{ resume: rcAuthToken }]
					})
				);
			}
		});

		this.rcWebsocket.onmessage = (event) => {
			if (
				this.rcWebsocket &&
				this.rcWebsocket.readyState === SOCKET_STATUS.OPEN
			) {
				const response = JSON.parse(event.data);

				this.messageListeners.forEach((listener: Function) => {
					listener(response);
				});

				if (response.msg === 'result' && response.id === this.rcUid) {
					// subscribe
					this.subscriptions.forEach((sub: any) => {
						if (sub.name === SOCKET_COLLECTION.NOTIFY_USER) {
							this.subscribe(
								sub.name,
								sub.params,
								null,
								sub.callback
							);
						}
						if (sub.name === SOCKET_COLLECTION.ROOM_MESSAGES) {
							this.subscribe(
								sub.name,
								sub.params,
								sub.callback,
								null
							);
						}
						if (sub.name === SOCKET_COLLECTION.NOTIFY_ROOM) {
							this.subscribe(
								sub.name,
								sub.params,
								null,
								null,
								sub.callback
							);
						}
					});
				}
			}
		};

		this.keepAlive();

		this.rcWebsocket.onclose = function (event) {};

		this.rcWebsocket.onerror = function (event) {};
	}

	public close() {
		if (this.rcWebsocket) {
			this.rcWebsocket.close();
		}
	}

	private keepAlive() {
		this.addMessageListeners((response) => {
			// each ping from server need a 'pong' back
			if (response.msg === 'ping' && this.rcWebsocket) {
				this.rcWebsocket.send(
					JSON.stringify({
						msg: 'pong'
					})
				);
			}
		});
	}

	public addMessageListeners(listener: Function) {
		this.messageListeners.push(listener);
	}

	public addSubscription(
		name: string,
		params: any = [],
		callback: Function | null = null
	) {
		this.subscriptions.push({ name, params, callback });
	}

	private subscribe(
		name: string,
		params: any = [],
		callbackRoom: Function | null = null,
		callbackUser: Function | null = null,
		callbackTyping: Function | null = null
	) {
		this.rcWebsocket?.send(
			JSON.stringify({
				msg: 'sub',
				id: this.rcUid + '/' + name,
				name: name,
				params: params
			})
		);

		this.addMessageListeners((response) => {
			const changeResponseOnSubscribedEvent =
				response.msg === 'changed' &&
				response.fields?.eventName === params[0];

			if (changeResponseOnSubscribedEvent) {
				const newMessage =
					response.collection === SOCKET_COLLECTION.ROOM_MESSAGES;
				const isTechnicalMessage =
					response.fields.args[0].u?.username ===
					'rocket-chat-technical-user';
				const roomClosed =
					response.collection === SOCKET_COLLECTION.NOTIFY_USER &&
					response.fields.args &&
					response.fields.args[0] === 'removed' &&
					response.fields.args[1].u._id === this.rcUid;
				const userTyping =
					response.collection === SOCKET_COLLECTION.NOTIFY_ROOM;

				const userMuted =
					response.collection === SOCKET_COLLECTION.ROOM_MESSAGES &&
					response.fields.args &&
					response.fields.args[0].t === 'user-muted';
				if (userMuted) {
					callbackRoom({
						userMuted: decodeUsername(response.fields.args[0].msg)
					});
				} else if (newMessage && callbackRoom && !isTechnicalMessage) {
					callbackRoom();
				} else if (roomClosed && callbackUser) {
					callbackUser();
				} else if (userTyping && callbackTyping) {
					callbackTyping(response.fields.args);
				}
			}
		});
	}

	public sendTypingState(methodName: string, params: any = []) {
		if (
			this.rcWebsocket &&
			this.rcWebsocket.readyState === SOCKET_STATUS.OPEN
		) {
			this.rcWebsocket.send(
				JSON.stringify({
					msg: 'method',
					method: methodName,
					params: params,
					id: this.rcUid + '/' + methodName
				})
			);
		}
	}
}
