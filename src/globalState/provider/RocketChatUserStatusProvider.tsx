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
import { apiRocketChatUsersGetStatus } from '../../api/apiRocketChatUsersGetStatus';
import { getValueFromCookie } from '../../components/sessionCookie/accessSessionCookie';
import {
	EVENT_USER_STATUS,
	Status,
	STATUS_AWAY,
	STATUS_BUSY,
	STATUS_OFFLINE,
	STATUS_ONLINE,
	SUB_STREAM_NOTIFY_LOGGED
} from '../../components/app/RocketChat';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import useDebounceCallback from '../../hooks/useDebounceCallback';

type UserId = string;
type EncUserName = string;
type IntStatus = 0 | 1 | 2 | 3;

const STATUS: Status[] = [
	STATUS_OFFLINE,
	STATUS_ONLINE,
	STATUS_AWAY,
	STATUS_BUSY
];

type RocketChatUserStatus = {
	_id: UserId;
	status: Status;
	connectionStatus: 'online' | 'offline';
	success: boolean;
};

const initialStatus: RocketChatUserStatus = {
	_id: '',
	status: STATUS_OFFLINE,
	connectionStatus: 'offline',
	success: false
};

export const RocketChatUserStatusContext =
	createContext<RocketChatUserStatus>(initialStatus);

type RocketChatUserStatusProviderProps = {
	children: ReactNode;
};

export function RocketChatUserStatusProvider({
	children
}: RocketChatUserStatusProviderProps) {
	const { ready, subscribe, unsubscribe } = useContext(RocketChatContext);
	const rcUid = getValueFromCookie('rc_uid');

	const [status, setStatus] = useState(initialStatus);

	const statusChanged = useUpdatingRef(
		useDebounceCallback(
			useCallback(
				(res: [UserId, EncUserName, IntStatus][]) => {
					const statusChange = res
						.reverse()
						.find(([[[id]]]) => id === rcUid);
					if (!statusChange) {
						return;
					}

					const [[[, , newStatus]]] = statusChange;
					setStatus((prevState) => {
						if (prevState.status === STATUS[newStatus]) {
							return prevState;
						}

						return {
							...prevState,
							status: STATUS[newStatus]
						};
					});
				},
				[rcUid]
			),
			1000,
			true
		)
	);

	useEffect(() => {
		if (!rcUid || !ready) {
			return;
		}

		apiRocketChatUsersGetStatus(rcUid)
			.then((res) => {
				setStatus(res);
			})
			.then(() => {
				subscribe(
					{
						name: SUB_STREAM_NOTIFY_LOGGED,
						event: EVENT_USER_STATUS
					},
					statusChanged
				);
			})
			.catch((err) => {
				console.error(err);
			}); // Ignore errors

		return () => {
			unsubscribe(
				{
					name: SUB_STREAM_NOTIFY_LOGGED,
					event: EVENT_USER_STATUS
				},
				statusChanged
			);
		};
	}, [rcUid, ready, statusChanged, subscribe, unsubscribe]);

	return (
		<RocketChatUserStatusContext.Provider value={status}>
			{children}
		</RocketChatUserStatusContext.Provider>
	);
}
