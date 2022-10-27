import * as React from 'react';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react';
import { RocketChatContext } from './RocketChatProvider';
import { METHOD_GET_USER_ROLES } from '../../components/app/RocketChat';

interface IUser {
	_id: string;
	roles: string[];
	username: string;
}

type RocketChatSubscriptionsContextProps = {
	systemUsersReady: boolean;
	systemUsers: IUser[];
};

export const RocketChatGetUserRolesContext =
	createContext<RocketChatSubscriptionsContextProps>(null);

type RocketChatGetUserRolesProviderProps = {
	children: ReactNode;
};

export const RocketChatGetUserRolesProvider = ({
	children
}: RocketChatGetUserRolesProviderProps) => {
	const { sendMethod, ready } = useContext(RocketChatContext);

	const [systemUsersReady, setSystemUsersReady] = useState(false);
	const [systemUsers, setSystemUsers] = useState<IUser[]>([]);

	useEffect(() => {
		if (ready) {
			sendMethod(
				METHOD_GET_USER_ROLES,
				['admin', 'system', 'technical', 'app'],
				(users) => {
					setSystemUsers(users);
					setSystemUsersReady(true);
				}
			);
		} else {
			setSystemUsersReady(false);
		}
	}, [ready, sendMethod]);

	return (
		<RocketChatGetUserRolesContext.Provider
			value={{ systemUsersReady, systemUsers }}
		>
			{children}
		</RocketChatGetUserRolesContext.Provider>
	);
};
