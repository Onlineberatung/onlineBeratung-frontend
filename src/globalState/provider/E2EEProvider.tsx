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

interface E2EEContextProps {
	key: string;
	subscriptions: SubscriptionType[];
	rooms: any[];
	refresh: () => void;
	reloadPrivateKey: () => void;
	isE2eeEnabled: boolean;
	setIsE2eeEnabled: (isE2eeEnabled: boolean) => void;
}

export const E2EEContext = createContext<E2EEContextProps>(null);

export function E2EEProvider(props) {
	const [key, setKey] = useState(null);
	const [subscriptions, setSubscriptions] = useState<
		DecryptedSubscriptionType[]
	>([]);
	const [rooms, setRooms] = useState<any[]>([]);
	const [isE2eeEnabled, setIsE2eeEnabled] = useState(false);

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

	useEffect(() => {
		// TODO get setting from RC Socket
		setIsE2eeEnabled(true);
	}, []);

	return (
		<E2EEContext.Provider
			value={{
				isE2eeEnabled,
				setIsE2eeEnabled,
				key,
				subscriptions,
				rooms,
				refresh,
				reloadPrivateKey
			}}
		>
			{props.children}
		</E2EEContext.Provider>
	);
}
