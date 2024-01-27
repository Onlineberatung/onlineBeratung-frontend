import * as React from 'react';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react';
import { RocketChatContext } from './RocketChatProvider';
import {
	METHOD_GET_USERS_OF_ROOM,
	SUB_STREAM_ROOM_MESSAGES,
	UserResponse
} from '../../components/app/RocketChat';
import { ActiveSessionContext } from './ActiveSessionProvider';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import { isUserModerator } from '../../components/session/sessionHelpers';
import { RocketChatGetUserRolesContext } from './RocketChatSytemUsersProvider';

type RocketChatUsersOfRoomContextProps = {
	ready: boolean;
	users: UserResponse[];
	moderators: string[];
	total: number;
	reload: (roomId: string) => Promise<UserResponse[]>;
};

export const RocketChatUsersOfRoomContext =
	createContext<RocketChatUsersOfRoomContextProps>(null);

type RocketChatUsersOfRoomProviderProps = {
	watch?: boolean;
	children: ReactNode;
};

export const RocketChatUsersOfRoomProvider = ({
	watch = false,
	children
}: RocketChatUsersOfRoomProviderProps) => {
	const {
		sendMethod,
		ready: socketReady,
		subscribe,
		unsubscribe
	} = useContext(RocketChatContext);
	const { activeSession } = useContext(ActiveSessionContext);
	const { systemUsers } = useContext(RocketChatGetUserRolesContext);

	const [ready, setReady] = useState(false);
	const [total, setTotal] = useState(0);
	const [users, setUsers] = useState<UserResponse[]>([]);
	const [moderators, setModerators] = useState(undefined);

	const canLoadMembers = useMemo(
		() =>
			activeSession?.item &&
			(!activeSession.isGroup || activeSession.item.active),
		[activeSession?.isGroup, activeSession?.item]
	);

	// Get all moderators of room
	useEffect(() => {
		if (!canLoadMembers) return;
		setModerators(
			users
				.filter((user) =>
					isUserModerator({
						chatItem: activeSession.item,
						rcUserId: user._id
					})
				)
				.map((user) => user._id)
		);
	}, [canLoadMembers, activeSession?.item, users]);

	const load = useCallback(
		async (rid: string) => {
			const res = await sendMethod(METHOD_GET_USERS_OF_ROOM, [
				rid,
				true,
				{ limit: 0, skip: 0 }
			]);

			if (!res) console.error('No users found for room: ', rid);

			// Filter system user and users with unencrypted username (Maybe more system users)
			const users = (res?.records || [])
				.filter(
					(member) =>
						member.username !== 'System' &&
						member.username.indexOf('enc.') === 0 &&
						!systemUsers.find(
							(systemUser) => systemUser._id === member._id
						)
				)
				.map((user) => ({ ...user, displayName: user.name }));
			setUsers(users);
			setTotal(res?.total || 0);
			return users;
		},
		[sendMethod, systemUsers]
	);

	const onUsersChange = useCallback(
		(args) => {
			if (args.length === 0) return;

			// If user added (au) or removed (ru) update members list
			if (args.find(({ t }) => t === 'au' || t === 'ru')) {
				load(activeSession?.rid);
			}
		},
		[load, activeSession?.rid]
	);

	const onUsersChangeRef = useUpdatingRef(onUsersChange);

	useEffect(() => {
		let subscribed = false;

		if (socketReady && canLoadMembers) {
			load(activeSession.rid).then(() => {
				setReady(true);
			});

			if (watch) {
				subscribed = true;
				subscribe(
					{
						name: SUB_STREAM_ROOM_MESSAGES,
						roomId: activeSession?.rid
					},
					onUsersChangeRef
				);
			}
		} else if (!activeSession?.rid && activeSession.isEmptyEnquiry) {
			setReady(true);
		}

		return () => {
			setReady(false);
			if (subscribed) {
				subscribed = false;
				unsubscribe(
					{
						name: SUB_STREAM_ROOM_MESSAGES,
						roomId: activeSession?.rid
					},
					onUsersChangeRef
				);
			}
		};
	}, [
		activeSession?.rid,
		socketReady,
		load,
		activeSession?.isEmptyEnquiry,
		canLoadMembers,
		subscribe,
		unsubscribe,
		onUsersChangeRef,
		watch
	]);

	const context = useMemo(
		() => ({ ready, users, moderators, total, reload: load }),
		[ready, users, moderators, total, load]
	);

	if (!ready) {
		return null;
	}

	return (
		<RocketChatUsersOfRoomContext.Provider value={context}>
			{children}
		</RocketChatUsersOfRoomContext.Provider>
	);
};
