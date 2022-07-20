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
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';

export type e2eeParams = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
	encrypted?: boolean;
};

export interface UseE2EEParams extends e2eeParams {
	addNewUsersToEncryptedRoom?: any;
	ready: boolean;
	subscriptionKeyLost: boolean;
	roomNotFound: boolean;
}

export const useE2EE = (
	rid: string | null,
	triggerReEncrypt: boolean = false
): UseE2EEParams => {
	const { key: e2eePrivateKey } = useContext(E2EEContext);
	const { subscriptions, rooms } = useContext(RocketChatSubscriptionsContext);
	const [key, setKey] = useState(null);
	const [keyID, setKeyID] = useState(null);
	const [encrypted, setEncrypted] = useState(false);
	const [subscriptionKeyLost, setSubscriptionKeyLost] = useState(false);
	const [roomNotFound, setRoomNotFound] = useState(false);
	const [sessionKeyExportedString, setSessionKeyExportedString] =
		useState(null);
	const [ready, setReady] = useState(false);
	const rcUid = getValueFromCookie('rc_uid');

	const keyIdRef = useRef(null);
	const sessionKeyExportedStringRef = useRef(null);

	const addNewUsersToEncryptedRoom = useCallback(async () => {
		try {
			if (subscriptionKeyLost) {
				return;
			}

			const { members } = await apiRocketChatGroupMembers(rid);

			const filteredMembers = members
				// Filter system user and users with unencrypted username (Maybe more system users)
				.filter(
					(member) =>
						member.username !== 'System' &&
						member.username.indexOf('enc.') === 0 &&
						member._id !== rcUid
				);

			if (filteredMembers.length <= 0) {
				return;
			}

			const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(rid);

			if (users.length <= 0) {
				return;
			}

			await Promise.all(
				users.map(async (user) => {
					// only check in filtered members for the user
					if (
						!filteredMembers.find(
							(member) => member._id === user._id
						)
					) {
						return;
					}

					const userKey = await encryptForParticipant(
						user.e2e.public_key,
						keyIdRef.current,
						sessionKeyExportedStringRef.current
					);

					return apiRocketChatUpdateGroupKey(user._id, rid, userKey);
				})
			);
		} catch (e) {
			// no error handling // intentional
		}
	}, [rcUid, rid, subscriptionKeyLost]);

	useEffect(() => {
		keyIdRef.current = keyID;
	}, [keyID]);

	useEffect(() => {
		sessionKeyExportedStringRef.current = sessionKeyExportedString;
	}, [sessionKeyExportedString]);

	useEffect(() => {
		if (triggerReEncrypt) {
			addNewUsersToEncryptedRoom().then();
		}
	}, [addNewUsersToEncryptedRoom, triggerReEncrypt]);

	useEffect(() => {
		if (!rid) {
			setReady(true);
			return;
		}

		const currentRoom = rooms.find((room) => room._id === rid);

		if (!currentRoom) {
			setRoomNotFound(true);
			setReady(true);
			return;
		}

		if (!currentRoom.e2eKeyId) {
			// not encrypted -> reset
			setEncrypted(false);
			setKey(null);
			setKeyID(null);
			setSessionKeyExportedString(null);
			setReady(true);
			return;
		}

		setEncrypted(true);

		const subscription = subscriptions.find((s) => s.rid === rid);

		if (!subscription?.E2EKey) {
			setSubscriptionKeyLost(true);
			setReady(true);
			return;
		}

		// Prevent multiple decryptions
		if (keyID) {
			setReady(true);
			return;
		}

		importGroupKey(subscription.E2EKey, e2eePrivateKey).then(
			({ key, keyID, sessionKeyExportedString }) => {
				setKey(key);
				setKeyID(keyID);
				setSessionKeyExportedString(sessionKeyExportedString);
				setReady(true);
			}
		);

		return () => {
			setSubscriptionKeyLost(false);
			setRoomNotFound(false);
		};
	}, [e2eePrivateKey, keyID, rid, rooms, subscriptions]);

	useEffect(() => {
		return () => {
			setEncrypted(false);
			setSubscriptionKeyLost(false);
			setRoomNotFound(false);
			setKey(null);
			setKeyID(null);
			setSessionKeyExportedString(null);
			setReady(false);
		};
	}, [rid]);

	return {
		key,
		keyID,
		encrypted,
		sessionKeyExportedString,
		addNewUsersToEncryptedRoom,
		ready,
		subscriptionKeyLost,
		roomNotFound
	};
};
