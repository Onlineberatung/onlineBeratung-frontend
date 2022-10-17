import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiRocketChatGetUsersOfRoomWithoutKey } from '../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatGroupMembers } from '../api/apiRocketChatGroupMembers';
import { apiRocketChatUpdateGroupKey } from '../api/apiRocketChatUpdateGroupKey';
import { E2EEContext } from '../globalState';
import {
	createGroupKey,
	encryptForParticipant,
	importGroupKey
} from '../utils/encryptionHelpers';
import { RocketChatSubscriptionsContext } from '../globalState/provider/RocketChatSubscriptionsProvider';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import {
	ENCRYPT_ROOM_STATE_DONE,
	ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
	ENCRYPT_ROOM_STATE_ERROR,
	ENCRYPT_ROOM_STATE_GET_MEMBERS,
	ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY,
	TEncryptRoomState
} from '../utils/e2eeHelper';

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

const KEY_TYPE_GENERATED = 'generated';
const KEY_TYPE_IMPORTED = 'imported';

export const useE2EE = (
	rid: string | null,
	triggerReEncrypt: boolean = false
): UseE2EEParams => {
	const {
		key: e2eePrivateKey,
		isE2eeEnabled,
		e2EEReady
	} = useContext(E2EEContext);
	const { subscriptionsReady, subscriptions, roomsReady, rooms } = useContext(
		RocketChatSubscriptionsContext
	);
	const [key, setKey] = useState(null);
	const [keyID, setKeyID] = useState(null);
	const [encrypted, setEncrypted] = useState(false);
	const [subscriptionKeyLost, setSubscriptionKeyLost] = useState(false);
	const [roomNotFound, setRoomNotFound] = useState(false);
	const [sessionKeyExportedString, setSessionKeyExportedString] =
		useState(null);
	const [ready, setReady] = useState(false);
	const rcUid = getValueFromCookie('rc_uid');

	const keyType = useRef(null);
	const keyIdRef = useRef(null);
	const sessionKeyExportedStringRef = useRef(null);

	const addNewUsersToEncryptedRoom = useCallback(
		async (onStateChange?: (state: TEncryptRoomState) => void) => {
			try {
				if (!encrypted || subscriptionKeyLost) {
					onStateChange &&
						onStateChange({
							state: ENCRYPT_ROOM_STATE_DONE,
							count: 0,
							total: 0
						});
					return;
				}

				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_GET_MEMBERS,
						count: 0,
						total: 0
					});
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
					onStateChange &&
						onStateChange({
							state: ENCRYPT_ROOM_STATE_DONE,
							count: 0,
							total: 0
						});
					return;
				}

				let unhandledMembers = filteredMembers.length;
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY,
						count: filteredMembers.length - unhandledMembers,
						total: filteredMembers.length
					});
				const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(
					rid
				);

				if (users.length <= 0) {
					onStateChange &&
						onStateChange({
							state: ENCRYPT_ROOM_STATE_DONE,
							count: 0,
							total: 0
						});
					return;
				}

				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
						count: filteredMembers.length - unhandledMembers,
						total: filteredMembers.length
					});

				await Promise.all(
					users.map(async (user) => {
						// only check in filtered members for the user
						if (
							!filteredMembers.find(
								(member) => member._id === user._id
							)
						) {
							unhandledMembers--;
							onStateChange &&
								onStateChange({
									state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
									count:
										filteredMembers.length -
										unhandledMembers,
									total: filteredMembers.length
								});
							return;
						}

						const userKey = await encryptForParticipant(
							user.e2e.public_key,
							keyIdRef.current,
							sessionKeyExportedStringRef.current
						);

						return apiRocketChatUpdateGroupKey(
							user._id,
							rid,
							userKey
						).then(() => {
							unhandledMembers--;
							onStateChange &&
								onStateChange({
									state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
									count:
										filteredMembers.length -
										unhandledMembers,
									total: filteredMembers.length
								});
						});
					})
				);

				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_DONE,
						count: filteredMembers.length - unhandledMembers,
						total: filteredMembers.length
					});
			} catch (e) {
				// no error handling // intentional
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_ERROR,
						count: 0,
						total: 0
					});
			}
		},
		[encrypted, rcUid, rid, subscriptionKeyLost]
	);

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

	const generateKeys = useCallback(() => {
		// Key already generated. No regeneration required.
		if (keyType.current === KEY_TYPE_GENERATED) {
			return;
		}

		// Generate new keys for feature encryption
		createGroupKey().then(({ keyID, key, sessionKeyExportedString }) => {
			keyType.current = KEY_TYPE_GENERATED;
			setKey(key);
			setKeyID(keyID);
			setSessionKeyExportedString(sessionKeyExportedString);
			setReady(true);
		});
	}, []);

	useEffect(() => {
		const cleanup = () => {
			setSubscriptionKeyLost(false);
			setRoomNotFound(false);
		};

		// Wait for e2ee logic is fully loaded
		if (!e2EEReady) {
			return cleanup;
		}

		if (!isE2eeEnabled) {
			setReady(true);
			return cleanup;
		}

		// Wait for rooms and subscriptions are loaded
		if (!roomsReady || !subscriptionsReady) {
			return cleanup;
		}

		const currentRoom = rooms.find((room) => room._id === rid);

		if (!currentRoom) {
			setRoomNotFound(true);
			generateKeys();
			return cleanup;
		}

		if (!currentRoom.e2eKeyId) {
			// not encrypted -> reset
			setEncrypted(false);
			generateKeys();
			return cleanup;
		}

		setEncrypted(true);

		const subscription = subscriptions.find((s) => s.rid === rid);

		if (!subscription?.E2EKey) {
			setSubscriptionKeyLost(true);
			setReady(true);
			return cleanup;
		}

		// If key was already imported prevent reimport
		if (keyType.current === KEY_TYPE_IMPORTED) {
			setReady(true);
			return cleanup;
		}

		importGroupKey(subscription.E2EKey, e2eePrivateKey)
			.then(({ key, keyID, sessionKeyExportedString }) => {
				setKey(key);
				keyType.current = KEY_TYPE_IMPORTED;
				// Generate key with old generation logic for old chats
				// ToDo: Could be removed if no old chats with room.e2eKeyId === 'eyJhbGciOiJB' exists anymore
				const oldE2EKeyId = btoa(sessionKeyExportedString).slice(0, 12);
				setKeyID(
					currentRoom.e2eKeyId === oldE2EKeyId
						? currentRoom.e2eKeyId
						: keyID
				);
				setSessionKeyExportedString(sessionKeyExportedString);
				setReady(true);
			})
			.catch(() => {
				console.log(rid, subscription.E2EKey);
			});

		return cleanup;
	}, [
		e2EEReady,
		e2eePrivateKey,
		generateKeys,
		isE2eeEnabled,
		rid,
		rooms,
		roomsReady,
		subscriptions,
		subscriptionsReady
	]);

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
