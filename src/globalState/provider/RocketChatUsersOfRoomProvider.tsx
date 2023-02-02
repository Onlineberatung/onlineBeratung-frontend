import * as React from 'react';
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { RocketChatContext } from './RocketChatProvider';
import {
	METHOD_GET_USERS_OF_ROOM,
	UserResponse
} from '../../components/app/RocketChat';
import { ActiveSessionContext } from './ActiveSessionProvider';

type RocketChatUsersOfRoomContextProps = {
	ready: boolean;
	users: UserResponse[];
	total: number;
	reload: (roomId: string) => Promise<UserResponse[]>;
};

export const RocketChatUsersOfRoomContext =
	createContext<RocketChatUsersOfRoomContextProps>(null);

type RocketChatUsersOfRoomProviderProps = {
	children: ReactNode;
};

export const RocketChatUsersOfRoomProvider = ({
	children
}: RocketChatUsersOfRoomProviderProps) => {
	const { sendMethod, ready: socketReady } = useContext(RocketChatContext);
	const { activeSession } = useContext(ActiveSessionContext);

	const [ready, setReady] = useState(false);
	const [total, setTotal] = useState(0);
	const [users, setUsers] = useState<UserResponse[]>([]);

	const load = useCallback(
		async (rid: string) => {
			const res = await sendMethod(METHOD_GET_USERS_OF_ROOM, [
				rid,
				true,
				{ limit: 0, skip: 0 }
			]);

			if (res) {
				setUsers(res.records);
				setTotal(res.total);
				return res.records;
			}
			console.error('No users found for room: ', rid);
			setUsers([]);
			setTotal(0);
			return [];
		},
		[sendMethod]
	);

	useEffect(() => {
		if (socketReady && activeSession?.rid) {
			load(activeSession.rid).then(() => {
				setReady(true);
			});
		} else if (!activeSession?.rid && activeSession.isEmptyEnquiry) {
			setReady(true);
		}

		return () => {
			setReady(false);
		};
	}, [activeSession?.rid, socketReady, load, activeSession.isEmptyEnquiry]);

	if (!ready) {
		return null;
	}

	return (
		<RocketChatUsersOfRoomContext.Provider
			value={{ ready, users, total, reload: load }}
		>
			{children}
		</RocketChatUsersOfRoomContext.Provider>
	);
};
