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
import { RocketChatContext } from '../index';
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

type RocketChatSubscriptionsContextProps = {
	subscriptions: any[];
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

	const [subscriptions, setSubscriptions] = useState<ISubscriptions[]>([]);
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
			console.log('Notificationn');
			console.log(args);
		}, [])
	);

	useEffect(() => {
		const userId = rcUid.current;

		if (ready && !subscribed.current) {
			subscribed.current = true;

			// Get user rooms
			sendMethod(METHOD_ROOMS_GET, [], (rooms) => {
				setRooms(rooms ?? []);

				subscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_ROOMS_CHANGED,
						userId
					},
					roomsChanged
				);
			});

			// Get user subscriptions
			sendMethod(METHOD_SUBSCRIPTIONS_GET, [], (subscriptions) => {
				setSubscriptions(subscriptions ?? []);

				subscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_SUBSCRIPTIONS_CHANGED,
						userId
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
		}

		return () => {
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
		subscriptionsChanged
	]);

	return (
		<RocketChatSubscriptionsContext.Provider
			value={{ subscriptions, rooms }}
		>
			{children}
		</RocketChatSubscriptionsContext.Provider>
	);
};
