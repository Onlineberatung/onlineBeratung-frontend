import { getTokenFromCookie } from '../../sessionCookie/ts/accessSessionCookie';

const SOCKET_STATUS = {
	CONNECTING: 0,
	OPEN: 1,
	CLOSING: 2,
	CLOSED: 3
};

export class rocketChatSocket {
	private rcUid = null;
	private rcWebsocket = null;
	private subscriptions = [];
	private messageListeners = [];

	constructor() {
		this.rcUid = getTokenFromCookie('rc_uid');
		this.rcWebsocket = null;
	}

	private getEndpoint() {
		const host = window.location.hostname;
		const secure = /https/g.test(window.location.protocol);
		if (host !== 'caritas.local') {
			return `ws${secure ? 's' : ''}://${host}/websocket`;
		}
		return `ws${secure ? 's' : ''}://${host}:3000/websocket`;
	}

	public connect() {
		const rcAuthToken = getTokenFromCookie('rc_token');
		this.rcWebsocket = new WebSocket(this.getEndpoint());

		this.rcWebsocket.onopen = () => {
			if (this.rcWebsocket.readyState === SOCKET_STATUS.OPEN) {
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
		};

		this.rcWebsocket.onmessage = (event) => {
			if (
				this.rcWebsocket &&
				this.rcWebsocket.readyState === SOCKET_STATUS.OPEN
			) {
				const response = JSON.parse(event.data);

				this.messageListeners.forEach((listener) => {
					listener(response);
				});

				if (response.msg == 'result' && response.id === this.rcUid) {
					// subscribe
					this.subscriptions.forEach((sub) => {
						if (sub.name === 'stream-notify-user') {
							this.subscribe(
								sub.name,
								sub.params,
								null,
								sub.callback
							);
						}
						if (sub.name === 'stream-room-messages') {
							this.subscribe(
								sub.name,
								sub.params,
								sub.callback,
								null
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
			if (response.msg == 'ping') {
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
		callback: Function = null
	) {
		this.subscriptions.push({ name, params, callback });
	}

	private subscribe(
		name: string,
		params: any = [],
		callbackRoom: Function = null,
		callbackUser: Function = null
	) {
		this.rcWebsocket.send(
			JSON.stringify({
				msg: 'sub',
				id: this.rcUid + name,
				name: name,
				params: params
			})
		);

		this.addMessageListeners((response) => {
			if (
				response.msg == 'changed' &&
				response.collection == 'stream-room-messages' &&
				response.fields &&
				response.fields.eventName &&
				response.fields.eventName == params[0]
			) {
				if (callbackRoom) {
					callbackRoom();
				}
			} else if (
				response.msg === 'changed' &&
				response.collection === 'stream-notify-user' &&
				response.fields &&
				response.fields.eventName &&
				response.fields.eventName == params[0] &&
				response.fields.args &&
				response.fields.args[0] === 'removed' &&
				response.fields.args[1].u._id === this.rcUid
			) {
				if (callbackUser) {
					callbackUser(response);
				}
			}
		});
	}
}
