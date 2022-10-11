import * as React from 'react';
import { v4 as uuid } from 'uuid';
import {
	createContext,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import { getValueFromCookie } from '../../components/sessionCookie/accessSessionCookie';
import {
	LISTENER_ADDED,
	LISTENER_CHANGED,
	LISTENER_CONNECTED,
	LISTENER_NOSUB,
	LISTENER_PING,
	LISTENER_RESULT,
	LISTENERS,
	METHOD_LOGIN,
	METHODS,
	MSG_CONNECT,
	MSG_METHOD,
	MSG_PONG,
	MSG_SUB,
	MSG_UNSUB,
	SUB_STREAM_NOTIFY_ROOM,
	SUB_STREAM_NOTIFY_ROOM_USERS,
	SUB_STREAM_NOTIFY_USER,
	SUB_STREAM_ROOM_MESSAGES,
	SUBSCRIPTION_PARAMS,
	SUBSCRIPTIONS
} from '../../components/app/RocketChat';
import { apiUrl } from '../../resources/scripts/endpoints';

const RECONNECT_TIMEOUT = 2000;

type SendParams = {
	id: string;
	[key: string]: any;
};

type RocketChatContextProps = {
	send: (params: SendParams, resultListener?: (res) => void) => void;
	subscribe: (
		subscription: SUBSCRIPTIONS,
		subscriber: MutableRefObject<any>,
		params?: SUBSCRIPTION_PARAMS
	) => void;
	ready: boolean;
	listen: (event: keyof LISTENERS, listener: (res) => void) => void;
	unsubscribe: (
		subscription: SUBSCRIPTIONS,
		subscriber: MutableRefObject<any>
	) => void;
	sendMethod: (
		method: METHODS,
		params: any,
		resultListener?: (res) => void
	) => void;
	close: () => void;
	rcWebsocket: WebSocket | null;
};

export const RocketChatContext = createContext<RocketChatContextProps>(null);

export function RocketChatProvider(props) {
	const rcUid = useRef(getValueFromCookie('rc_uid'));
	const rcAuthToken = useRef(getValueFromCookie('rc_token'));
	const rcWebsocket = useRef<WebSocket | null>(null);
	const rcWebsocketTimeout = useRef<number | null>(null);

	const subscriptions = useRef<{ [key: string]: MutableRefObject<any>[] }>(
		{}
	);
	const listeners = useRef<LISTENERS>({});
	const resultListeners = useRef<{ [key: string]: (result) => void }>({});

	const [ready, setReady] = useState(false);

	const getEndpoint = useCallback(() => {
		const host = window.location.hostname;
		if (apiUrl) {
			return `${apiUrl
				.replace('http://', 'ws://')
				.replace('https://', 'wss://')}/websocket`;
		}
		return `wss://${host}/websocket`;
	}, []);

	const close = useCallback(() => {
		if (rcWebsocketTimeout.current)
			window.clearTimeout(rcWebsocketTimeout.current);
		if (rcWebsocket.current) {
			rcWebsocket.current.close();
		}
	}, []);

	const listen = useCallback(
		(event: keyof LISTENERS, listener: (res) => void) => {
			const eventListeners = listeners.current?.[event] ?? [];
			if (
				!eventListeners.find(
					(eventListener) => eventListener === listener
				)
			) {
				eventListeners.push(listener);
			}
			listeners.current = {
				...listeners.current,
				[event]: eventListeners
			};
		},
		[]
	);

	const addSubscription = useCallback(
		(id: string, subscriber: MutableRefObject<any>) => {
			const subscriptionSubscribers = [
				...(subscriptions.current[id] ?? [])
			];
			// If subscriber is already added do nothing
			if (
				subscriptionSubscribers.find(
					(subscriptionSubscriber) =>
						subscriptionSubscriber === subscriber
				)
			) {
				return;
			}
			subscriptionSubscribers.push(subscriber);
			subscriptions.current = {
				...subscriptions.current,
				[id]: subscriptionSubscribers
			};
		},
		[]
	);

	const removeSubscription = useCallback((id: string) => {
		const newSubscriptions = { ...(subscriptions.current ?? {}) };
		delete newSubscriptions[id];
		subscriptions.current = newSubscriptions;
	}, []);

	const send = useCallback(
		(params: SendParams, resultListener?: (res) => void) => {
			if (rcWebsocket.current.readyState !== WebSocket.OPEN) {
				console.log('WebSocket not ready!');
				return;
			}
			if (resultListener) {
				resultListeners.current[params.id] = resultListener;
			}
			rcWebsocket.current?.send(JSON.stringify(params));
		},
		[]
	);

	const getSubscriptionId = useCallback((subscription: SUBSCRIPTIONS) => {
		let id;

		switch (subscription.name) {
			case SUB_STREAM_NOTIFY_ROOM:
				id = `${subscription.roomId}/${subscription.event}`;
				break;
			case SUB_STREAM_NOTIFY_USER:
			case SUB_STREAM_NOTIFY_ROOM_USERS:
				id = `${subscription.userId}/${subscription.event}`;
				break;
			case SUB_STREAM_ROOM_MESSAGES:
				id = subscription.roomId;
				break;
			default:
				id = subscription.event;
		}

		return id;
	}, []);

	const unsubscribe = useCallback(
		(subscription: SUBSCRIPTIONS, subscriber: MutableRefObject<any>) => {
			const id = getSubscriptionId(subscription);

			// If no subscriber is available
			if (!subscriptions.current?.[id]) {
				return;
			}

			// If subscriber is defined just remove one
			let subscriptionSubscribers = [
				...(subscriptions.current[id] ?? [])
			];
			if (subscriber) {
				const index = subscriptionSubscribers.findIndex(
					(subscriptionSubscriber) =>
						subscriptionSubscriber === subscriber
				);
				if (index < 0) {
					return;
				}
				subscriptionSubscribers.splice(index, 1);

				subscriptions.current = {
					...subscriptions.current,
					[id]: subscriptionSubscribers
				};

				// If there are still other subscribers left do not unsubscribe form RC
				if (subscriptionSubscribers.length > 0) {
					return;
				}
			}

			// Send subscribe to rocket.chat
			send({ msg: MSG_UNSUB, id });
		},
		[getSubscriptionId, send]
	);

	const subscribe = useCallback(
		(
			subscription: SUBSCRIPTIONS,
			subscriber: MutableRefObject<any>,
			params: SUBSCRIPTION_PARAMS = false
		) => {
			const id = getSubscriptionId(subscription);

			addSubscription(id, subscriber);

			// If already subscribed to rs just add a new subscriber
			if (subscriptions[id]) {
				return;
			}

			// Send subscribe to rocket.chat
			send({
				msg: MSG_SUB,
				id,
				name: subscription.name,
				params: [id, params]
			});
		},
		[addSubscription, getSubscriptionId, send]
	);

	const sendMethod = useCallback(
		(
			method: METHODS,
			params: any[] = null,
			resultListener?: (res) => void
		) => {
			send(
				{
					msg: MSG_METHOD,
					method: method,
					id: uuid(),
					...(params ? { params } : {})
				},
				resultListener
			);
		},
		[send]
	);

	const connect = useCallback(() => {
		setReady(false);
		rcWebsocket.current = new WebSocket(getEndpoint());

		listeners.current = {
			[LISTENER_NOSUB]: [
				(res) => {
					removeSubscription(res.id);
				}
			],
			[LISTENER_CONNECTED]: [
				() => {
					// login
					send(
						{
							msg: MSG_METHOD,
							method: METHOD_LOGIN,
							id: `${rcUid.current}/login`,
							params: [{ resume: rcAuthToken.current }]
						},
						() => {
							setReady(true);
						}
					);
				}
			],
			[LISTENER_ADDED]: [() => {}],
			[LISTENER_CHANGED]: [
				(res) => {
					(
						subscriptions.current?.[res.fields.eventName] ?? []
					).forEach((subscriber) =>
						subscriber.current(res.fields.args)
					);
				}
			],
			[LISTENER_PING]: [
				() => {
					rcWebsocket.current.send(
						JSON.stringify({
							msg: MSG_PONG
						})
					);
				}
			],
			[LISTENER_RESULT]: [
				(res) => {
					if (resultListeners.current?.[res.id]) {
						resultListeners.current[res.id](res.result);
					}
				}
			]
		};

		rcWebsocket.current.onopen = () => {
			if (rcWebsocket.current?.readyState === WebSocket.OPEN) {
				send({
					msg: MSG_CONNECT,
					version: '1',
					support: ['1'],
					id: uuid()
				});
			}
		};

		rcWebsocket.current.onmessage = (event) => {
			const response = JSON.parse(event.data);
			if (listeners.current?.[response.msg]) {
				listeners.current[response.msg].forEach((listener) =>
					listener(response)
				);
			}
		};

		rcWebsocket.current.onclose = () => {};

		rcWebsocket.current.onerror = (event) => {
			rcWebsocketTimeout.current = window.setTimeout(() => {
				rcWebsocket.current = null;
				connect();
			}, RECONNECT_TIMEOUT);
		};
	}, [getEndpoint, removeSubscription, send]);

	useEffect(() => {
		if (!rcWebsocket.current) {
			connect();
		}
		const websocket = rcWebsocket.current;

		return () => {
			if (rcWebsocketTimeout.current)
				window.clearTimeout(rcWebsocketTimeout.current);
			if (websocket) {
				websocket.close();
				rcWebsocket.current = null;
			}
			subscriptions.current = {};
			listeners.current = {};
		};
	}, [close, connect]);

	return (
		<RocketChatContext.Provider
			value={{
				send,
				subscribe,
				unsubscribe,
				sendMethod,
				listen,
				ready,
				close,
				rcWebsocket: rcWebsocket.current
			}}
		>
			{props.children}
		</RocketChatContext.Provider>
	);
}
