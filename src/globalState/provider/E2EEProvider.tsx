import * as React from 'react';
import {
	createContext,
	useState,
	useContext,
	useEffect,
	useCallback
} from 'react';
import {
	decryptRSA,
	importAESKey,
	importRSAKey,
	toString
} from '../../utils/encryptionHelpers';
import { apiRocketChatSubscriptionsGet } from '../../api/apiRocketChatSubscriptionsGet';
import { apiRocketChatRoomsGet } from '../../api/apiRocketChatRoomsGet';

// RC Response Type
type SubscriptionType = {
	E2EKey?: string;
	t: 'd' | 'c' | 'p' | 'l';
	ts: {
		$date: number;
	};
	ls: {
		$date: number;
	};
	name: string;
	rid: string;
	u: {
		_id: string;
		username: string;
	};
	open: boolean;
	alert: boolean;
	roles?: any;
	unread: number;
	tunread?: number;
	tunreadGroup?: number;
	tunreadUser?: number;
	_updatedAt: {
		$date: number;
	};
	_id: string;
	lr: {
		$date: number;
	};
	hideUnreadStatus: boolean;
	teamMain: boolean;
	teamId: string;
	userMentions: number;
	groupMentions: number;
	prid: string;
};

type RoomE2EDataType = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
};

type DecryptedSubscriptionType = SubscriptionType & {
	E2EKeyDecrypted?: RoomE2EDataType;
};

export const E2EEContext = createContext<{
	key: string;
	subscriptions: SubscriptionType[];
	rooms: any[];
	refresh: () => void;
}>(null);

export function E2EEProvider(props) {
	const [key, setKey] = useState(null);
	const [subscriptions, setSubscriptions] = useState<
		DecryptedSubscriptionType[]
	>([]);
	const [rooms, setRooms] = useState<any[]>([]);

	useEffect(() => {
		const privateKey = sessionStorage.getItem('private_key');
		if (!privateKey) {
			return;
		}
		importRSAKey(JSON.parse(privateKey), ['decrypt']).then(setKey);
	}, []);

	// ToDo: Refresh could later be replace by socket event subscription changed
	// ToDo: Remember last update and use "since" parameter to get only new rooms on refresh
	const refresh = useCallback(() => {
		apiRocketChatSubscriptionsGet().then(({ update }) => {
			setSubscriptions(update);
		});

		apiRocketChatRoomsGet().then(({ update }) => {
			setRooms(update);
		});
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return (
		<E2EEContext.Provider value={{ key, subscriptions, rooms, refresh }}>
			{props.children}
		</E2EEContext.Provider>
	);
}
