import { useContext, useEffect, useState } from 'react';
import { E2EEContext } from '../globalState';
import { importGroupKey } from '../utils/encryptionHelpers';

type useE2EEType = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
	encrypted?: boolean;
};

export const useE2EE = (rid: string): useE2EEType => {
	const {
		subscriptions,
		rooms,
		key: e2eePrivateKey
	} = useContext(E2EEContext);
	const [key, setKey] = useState(null);
	const [keyID, setKeyID] = useState(null);
	const [encrypted, setEncrypted] = useState(false);
	const [sessionKeyExportedString, setSessionKeyExportedString] =
		useState(null);

	useEffect(() => {
		const room = rooms.find((room) => room._id === rid);

		if (!room?.e2eKeyId) {
			return;
		}

		setEncrypted(true);

		const subscription = subscriptions.find(
			(subscription) => subscription.rid === rid
		);

		if (!subscription?.E2EKey) {
			return;
		}

		// Prevent multiple decryptions
		if (keyID) {
			return;
		}

		importGroupKey(subscription.E2EKey, e2eePrivateKey).then(
			({ key, keyID, sessionKeyExportedString }) => {
				setKey(key);
				setKeyID(keyID);
				setSessionKeyExportedString(sessionKeyExportedString);
			}
		);
	}, [e2eePrivateKey, keyID, rid, rooms, subscriptions]);

	return { key, keyID, encrypted, sessionKeyExportedString };
};
