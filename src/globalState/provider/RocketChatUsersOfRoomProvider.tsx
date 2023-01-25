import * as React from 'react';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react';
import { RocketChatContext } from './RocketChatProvider';
import { METHOD_GET_USERS_OF_ROOM } from '../../components/app/RocketChat';
import { ActiveSessionContext } from './ActiveSessionProvider';

interface IUser {
	_id: string;
	roles: string[];
	username: string;
}

type RocketChatUsersOfRoomContextProps = {
	ready: boolean;
	users: IUser[];
	total: number;
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
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		if (socketReady && activeSession?.rid) {
			sendMethod(
				METHOD_GET_USERS_OF_ROOM,
				[activeSession.rid, true, { limit: 0, skip: 0 }],
				(res) => {
					if (res) {
						setUsers(res.records);
						setTotal(res.total);
					} else {
						console.error(
							'No users found for room: ',
							activeSession.rid
						);
						setUsers([]);
						setTotal(0);
					}
					setReady(true);
				}
			);
		}

		return () => {
			setReady(false);
		};
	}, [activeSession.rid, socketReady, sendMethod, setUsers]);

	if (!ready) {
		return null;
	}

	return (
		<RocketChatUsersOfRoomContext.Provider value={{ ready, users, total }}>
			{children}
		</RocketChatUsersOfRoomContext.Provider>
	);
};
