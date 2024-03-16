import * as React from 'react';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { getValueFromCookie } from '../../components/sessionCookie/accessSessionCookie';
import {
	EVENT_NOTIFICATION,
	EVENT_ROOMS_CHANGED,
	EVENT_SUBSCRIPTIONS_CHANGED,
	METHOD_ROOMS_GET,
	METHOD_SUBSCRIPTIONS_GET,
	SUB_STREAM_NOTIFY_USER
} from '../../components/app/RocketChat';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import { ISubscriptions } from '../../types/rc/Subscriptions';
import { IRoom } from '../../types/rc/Room';
import useDebounceCallback from '../../hooks/useDebounceCallback';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import { RocketChatContext } from './RocketChatProvider';

type RocketChatSubscriptionsContextProps = {
	subscriptionsReady: boolean;
	subscriptions: any[];
	roomsReady: boolean;
	rooms: any[];
};

export const RocketChatSubscriptionsContext =
	createContext<RocketChatSubscriptionsContextProps>(null);

type RocketChatSubscriptionsProviderProps = {
	children: ReactNode;
};

export const RocketChatSubscriptionsProvider = ({
	children
}: RocketChatSubscriptionsProviderProps) => {
	const rcUid = useRef(getValueFromCookie('rc_uid'));

	const { subscribe, unsubscribe, sendMethod, ready } =
		useContext(RocketChatContext);

	const subscribed = useRef(false);

	const [subscriptionsReady, setSubscriptionsReady] = useState(false);
	const [subscriptions, setSubscriptions] = useState<ISubscriptions[]>([]);
	const [roomsReady, setRoomsReady] = useState(false);
	const [rooms, setRooms] = useState<IRoom[]>([]);

	const roomsChanged = useUpdatingRef(
		useDebounceCallback(
			useCallback((args: [[['inserted' | 'updated', any]]]) => {
				setRooms((rooms) => {
					const newRooms = [...rooms];
					args.forEach((room) => {
						const [[status, data]] = room;
						if (status === 'inserted') {
							newRooms.push(data);
						} else if (status === 'updated') {
							const index = newRooms.findIndex(
								(room) => room._id === data._id
							);
							if (index >= 0) {
								newRooms.splice(index, 1, data);
							}
						} else if (status === 'removed') {
							const index = newRooms.findIndex(
								(room) => room._id === data._id
							);
							if (index >= 0) {
								newRooms.splice(index, 1);
							}
						}
					});
					return newRooms;
				});
			}, []),
			500,
			true
		)
	);

	const subscriptionsChanged = useUpdatingRef(
		useDebounceCallback(
			useCallback((args: [[['inserted' | 'updated', any]]]) => {
				setSubscriptions((subscriptions) => {
					const newSubscriptions = [...subscriptions];
					args.forEach((subscription) => {
						const [[status, data]] = subscription;
						if (status === 'inserted') {
							newSubscriptions.push(data);
						} else if (status === 'updated') {
							const index = newSubscriptions.findIndex(
								(s) => s._id === data._id
							);
							if (index >= 0) {
								newSubscriptions.splice(index, 1, data);
							}
						} else if (status === 'removed') {
							const index = newSubscriptions.findIndex(
								(s) => s._id === data._id
							);
							if (index >= 0) {
								newSubscriptions.splice(index, 1);
							}
						}
					});
					return newSubscriptions;
				});
			}, []),
			500,
			true
		)
	);

	const onNotificationRef = useUpdatingRef(
		useCallback((args) => {
			//const [data] = args;
			//const { payload } = data;
			console.log('Notification');
			console.log(args);
		}, [])
	);

	const roomsRetryCount = useRef(1);
	const ROOMS_MAX_RETRIES = 3;
	const getRooms = useCallback(
		() =>
			new Promise<IRoom[]>((resolve, reject) => {
				sendMethod(METHOD_ROOMS_GET, [], (rooms) => {
					if (
						!rooms &&
						roomsRetryCount.current <= ROOMS_MAX_RETRIES
					) {
						roomsRetryCount.current++;
						getRooms().then(resolve).catch(reject);
						return;
					} else if (!rooms) {
						reject(new Error('Loading rooms failed'));
						return;
					}
					resolve(rooms);
				});
			}),
		[sendMethod]
	);

	const subscriptionsRetryCount = useRef(0);
	const SUBSCRIPTIONS_MAX_RETRIES = 3;
	const getSubscriptions = useCallback(
		() =>
			new Promise<ISubscriptions[]>((resolve, reject) => {
				// Get user subscriptions
				sendMethod(METHOD_SUBSCRIPTIONS_GET, [], (subscriptions) => {
					if (
						!subscriptions &&
						subscriptionsRetryCount.current <=
							SUBSCRIPTIONS_MAX_RETRIES
					) {
						subscriptionsRetryCount.current++;
						getSubscriptions().then(resolve).catch(reject);
						return;
					} else if (!subscriptions) {
						reject(new Error('Loading subscriptions failed'));
						return;
					}
					resolve(subscriptions);
				});
			}),
		[sendMethod]
	);

	useEffect(() => {
		const userId = rcUid.current;

		if (ready && !subscribed.current) {
			subscribed.current = true;

			getRooms()
				.then((rooms) => {
					setRooms(rooms);
					setRoomsReady(true);
				})
				.catch((e) => {
					setRooms([]);
					apiPostError({
						name: e.name,
						message: e.message,
						stack: e.stack,
						level: ERROR_LEVEL_WARN
					}).then();
				})
				.finally(() => {
					subscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_ROOMS_CHANGED,
							userId: rcUid.current
						},
						roomsChanged
					);
				});

			getSubscriptions()
				.then((subscriptions) => {
					setSubscriptions(subscriptions);
					setSubscriptionsReady(true);
				})
				.catch((e) => {
					setSubscriptions([]);
					apiPostError({
						name: e.name,
						message: e.message,
						stack: e.stack,
						level: ERROR_LEVEL_WARN
					}).then();
				})
				.finally(() => {
					subscribe(
						{
							name: SUB_STREAM_NOTIFY_USER,
							event: EVENT_SUBSCRIPTIONS_CHANGED,
							userId: rcUid.current
						},
						subscriptionsChanged
					);
				});

			subscribe(
				{
					name: SUB_STREAM_NOTIFY_USER,
					event: EVENT_NOTIFICATION,
					userId
				},
				onNotificationRef
			);
		} else if (!ready) {
			// If connection gets lost and is reconnected
			// Unsubscribe of old subscriptions is not required because
			// they will unsubscribed if connection gets lost
			subscribed.current = false;

			// Set rooms/subscriptions ready to false because on reconnect they will be reloaded
			setRoomsReady(false);
			setSubscriptionsReady(false);
		}

		return () => {
			roomsRetryCount.current = 1;
			subscriptionsRetryCount.current = 1;
			if (subscribed.current) {
				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_ROOMS_CHANGED,
						userId
					},
					roomsChanged
				);
				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_SUBSCRIPTIONS_CHANGED,
						userId
					},
					subscriptionsChanged
				);
				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_NOTIFICATION,
						userId
					},
					onNotificationRef
				);
			}
		};
	}, [
		onNotificationRef,
		ready,
		roomsChanged,
		sendMethod,
		subscribe,
		unsubscribe,
		subscribed,
		subscriptionsChanged,
		getRooms,
		getSubscriptions
	]);

	return (
		<RocketChatSubscriptionsContext.Provider
			value={{ subscriptions, subscriptionsReady, rooms, roomsReady }}
		>
			{children}
		</RocketChatSubscriptionsContext.Provider>
	);
};
