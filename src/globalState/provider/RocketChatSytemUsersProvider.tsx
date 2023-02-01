import * as React from 'react';
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react';
import { RocketChatContext } from './RocketChatProvider';
import {
	METHOD_GET_USER_ROLES,
	MethodGetUserRolesRes
} from '../../components/app/RocketChat';

type RocketChatGetUserRolesContextProps = {
	systemUsersReady: boolean;
	systemUsers: MethodGetUserRolesRes;
};

export const RocketChatGetUserRolesContext =
	createContext<RocketChatGetUserRolesContextProps>(null);

type RocketChatGetUserRolesProviderProps = {
	children: ReactNode;
};

export const RocketChatGetUserRolesProvider = ({
	children
}: RocketChatGetUserRolesProviderProps) => {
	const { sendMethod, ready } = useContext(RocketChatContext);

	const [systemUsersReady, setSystemUsersReady] = useState(false);
	const [systemUsers, setSystemUsers] = useState<MethodGetUserRolesRes>([]);

	useEffect(() => {
		if (ready) {
			sendMethod(METHOD_GET_USER_ROLES, null, (users) => {
				setSystemUsers(users);
				setSystemUsersReady(true);
			});
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
