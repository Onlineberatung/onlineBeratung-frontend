import * as React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { importRSAKey } from '../../utils/encryptionHelpers';
import { apiRocketChatSubscriptionsGet } from '../../api/apiRocketChatSubscriptionsGet';
import { apiRocketChatRoomsGet } from '../../api/apiRocketChatRoomsGet';
import { SubscriptionType } from '../../types/rc/SubscriptionType';

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
	reloadPrivateKey: () => void;
}>(null);

export function E2EEProvider(props) {
	const [key, setKey] = useState(null);
	const [subscriptions, setSubscriptions] = useState<
		DecryptedSubscriptionType[]
	>([]);
	const [rooms, setRooms] = useState<any[]>([]);

	const reloadPrivateKey = useCallback(() => {
		const privateKey = sessionStorage.getItem('private_key');
		if (!privateKey) {
			return;
		}
		importRSAKey(JSON.parse(privateKey), ['decrypt']).then(setKey);
	}, []);

	useEffect(() => {
		reloadPrivateKey();
	}, [reloadPrivateKey]);

	// ToDo: Refresh could later be replace by socket event subscription changed
	// ToDo: Remember last update and use "since" parameter to get only changed rooms on refresh
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
		<E2EEContext.Provider
			value={{ key, subscriptions, rooms, refresh, reloadPrivateKey }}
		>
			{props.children}
		</E2EEContext.Provider>
	);
}
