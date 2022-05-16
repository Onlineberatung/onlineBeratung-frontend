import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { E2EEContext } from '../globalState';
import { decryptRSA, importAESKey, toString } from '../utils/encryptionHelpers';

type useE2EEType = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
	encrypted?: boolean;
};

const importGroupKey = (groupKey, e2eePrivateKey): Promise<useE2EEType> =>
	new Promise(async (resolve, reject) => {
		// Get existing group key
		// const keyID = groupKey.slice(0, 12);
		groupKey = groupKey.slice(12);
		groupKey = atob(groupKey);
		groupKey = Uint8Array.from(Object.values(JSON.parse(groupKey)));

		// Decrypt obtained encrypted session key
		let sessionKeyExportedString;
		try {
			const decryptedKey = await decryptRSA(e2eePrivateKey, groupKey);
			sessionKeyExportedString = toString(decryptedKey);
		} catch (error) {
			console.error('Error decrypting group key: ', error);
			reject(error);
			return;
		}

		const keyID = btoa(sessionKeyExportedString).slice(0, 12);

		// Import session key for use.
		try {
			const key = await importAESKey(
				JSON.parse(sessionKeyExportedString)
			);
			// Key has been obtained. E2E is now in session.
			resolve({ key, keyID, sessionKeyExportedString });
		} catch (error) {
			console.error('Error decrypting group key: ', error);
			reject(error);
			return;
		}
	});

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
