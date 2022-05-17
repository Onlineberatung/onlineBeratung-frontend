import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiRocketChatGetUsersOfRoomWithoutKey } from '../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatGroupMembers } from '../api/apiRocketChatGroupMembers';
import { apiRocketChatUpdateGroupKey } from '../api/apiRocketChatUpdateGroupKey';
import { E2EEContext } from '../globalState';
import {
	encryptForParticipant,
	importGroupKey
} from '../utils/encryptionHelpers';

type useE2EEType = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
	encrypted?: boolean;
	addNewUsersToEncryptedRoom?: any;
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

	const keyIdRef = useRef(null);
	const sessionKeyExportedStringRef = useRef(null);

	// If hook is used search for members without key and set it
	/*
	ToDo: This is currenlty not working as fallback because room keys could not be resettet currenlty so there will never be users without keys
	useEffect(() => {
		if (!keyID || !sessionKeyExportedString || !rid) {
			return;
		}

		apiRocketChatGetUsersOfRoomWithoutKey(rid).then(({ users }) =>
			Promise.all(
				users
					.filter(
						(member) =>
							member.username !== 'System' &&
							member.username.indexOf('enc.') === 0
					)
					.map(async (user) => {
						const userKey = await encryptForParticipant(
							user.e2e.public_key,
							keyID,
							sessionKeyExportedString
						);

						return apiRocketChatUpdateGroupKey(
							user._id,
							rid,
							userKey
						);
					})
			)
		);
	}, [keyID, rid, sessionKeyExportedString]);
	 */

	const addNewUsersToEncryptedRoom = useCallback(async () => {
		const { members } = await apiRocketChatGroupMembers(rid);
		const filteredMembers = members
			// Filter system user and users with unencrypted username (Maybe more system users)
			.filter(
				(member) =>
					member.username !== 'System' &&
					member.username.indexOf('enc.') === 0
			);

		const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(rid);

		if (users) {
			await Promise.all(
				users.map(async (user) => {
					// only check in filtered members for the user
					if (
						filteredMembers.filter(
							(member) => member._id === user._id
						).length !== 1
					)
						return;

					let userKey;

					console.log(
						keyIdRef.current,
						sessionKeyExportedStringRef.current
					);

					userKey = await encryptForParticipant(
						user.e2e.public_key,
						keyIdRef.current,
						sessionKeyExportedStringRef.current
					);

					return apiRocketChatUpdateGroupKey(user._id, rid, userKey);
				})
			);
		}
	}, [rid]);

	useEffect(() => {
		keyIdRef.current = keyID;
	}, [keyID]);

	useEffect(() => {
		sessionKeyExportedStringRef.current = sessionKeyExportedString;
	}, [sessionKeyExportedString]);

	useEffect(() => {
		const room = rooms.find((room) => room._id === rid);

		if (!room?.e2eKeyId) {
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
