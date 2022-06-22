import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiRocketChatGetUsersOfRoomWithoutKey } from '../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatGroupMembers } from '../api/apiRocketChatGroupMembers';
import { apiRocketChatUpdateGroupKey } from '../api/apiRocketChatUpdateGroupKey';
import { E2EEContext } from '../globalState';
import {
	encryptForParticipant,
	importGroupKey
} from '../utils/encryptionHelpers';
import { RocketChatSubscriptionsContext } from '../globalState/provider/RocketChatSubscriptionsProvider';

export type e2eeParams = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
	encrypted?: boolean;
};

export interface UseE2EEParams extends e2eeParams {
	addNewUsersToEncryptedRoom?: any;
}

export const useE2EE = (rid: string): UseE2EEParams => {
	const { key: e2eePrivateKey } = useContext(E2EEContext);
	const { subscriptions, rooms } = useContext(RocketChatSubscriptionsContext);
	const [key, setKey] = useState(null);
	const [keyID, setKeyID] = useState(null);
	const [encrypted, setEncrypted] = useState(false);
	const [sessionKeyExportedString, setSessionKeyExportedString] =
		useState(null);

	const keyIdRef = useRef(null);
	const sessionKeyExportedStringRef = useRef(null);

	const addNewUsersToEncryptedRoom = useCallback(async () => {
		if (!keyID || !sessionKeyExportedString || !rid) {
			return;
		}

		const { members } = await apiRocketChatGroupMembers(rid);
		const filteredMembers = members
			// Filter system user and users with unencrypted username (Maybe more system users)
			.filter(
				(member) =>
					member.username !== 'System' &&
					member.username.indexOf('enc.') === 0
			);

		const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(rid);
		if (!users) return;

		await Promise.all(
			users.map(async (user) => {
				// only check in filtered members for the user
				if (
					filteredMembers.filter((member) => member._id === user._id)
						.length !== 1
				) {
					return;
				}

				// console.log(keyID, sessionKeyExportedString);
				const userKey = await encryptForParticipant(
					user.e2e.public_key,
					keyID,
					sessionKeyExportedString
				);

				return apiRocketChatUpdateGroupKey(user._id, rid, userKey);
			})
		);
	}, [keyID, rid, sessionKeyExportedString]);

	useEffect(() => {
		addNewUsersToEncryptedRoom();
	}, [addNewUsersToEncryptedRoom, keyID, rid, sessionKeyExportedString]);

	useEffect(() => {
		keyIdRef.current = keyID;
	}, [keyID]);

	useEffect(() => {
		sessionKeyExportedStringRef.current = sessionKeyExportedString;
	}, [sessionKeyExportedString]);

	useEffect(() => {
		const room = rooms.find((room) => room._id === rid);

		if (!room?.e2eKeyId) {
			// not encrypted -> reset
			setEncrypted(false);
			setKey(null);
			setKeyID(null);
			setSessionKeyExportedString(null);
			return;
		}

		setEncrypted(true);

		const subscription = subscriptions.find((s) => s.rid === rid);

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

	return {
		key,
		keyID,
		encrypted,
		sessionKeyExportedString,
		addNewUsersToEncryptedRoom
	};
};
