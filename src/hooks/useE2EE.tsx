import CryptoJS from 'crypto-js';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { apiRocketChatGetUsersOfRoomWithoutKey } from '../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatUpdateGroupKey } from '../api/apiRocketChatUpdateGroupKey';
import { E2EEContext } from '../globalState';
import {
	createGroupKey,
	encryptForParticipant,
	getTmpMasterKey,
	importGroupKey
} from '../utils/encryptionHelpers';
import { RocketChatSubscriptionsContext } from '../globalState/provider/RocketChatSubscriptionsProvider';
import { getValueFromCookie } from '../components/sessionCookie/accessSessionCookie';
import { apiRocketChatSetRoomKeyID } from '../api/apiRocketChatSetRoomKeyID';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../api/apiSendAliasMessage';
import { RocketChatUsersOfRoomContext } from '../globalState/provider/RocketChatUsersOfRoomProvider';

export const ENCRYPT_ROOM_STATE_GET_MEMBERS = 'get_members';
export const ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY = 'get_users_without_key';
export const ENCRYPT_ROOM_STATE_ENCRYPTING_USERS = 'encrypting_users';
export const ENCRYPT_ROOM_STATE_SET_ROOM_KEY = 'set_room_key';
export const ENCRYPT_ROOM_STATE_SEND_ALIAS_MESSAGE = 'send_alias_message';
export const ENCRYPT_ROOM_STATE_DONE = 'done';
export const ENCRYPT_ROOM_STATE_ERROR = 'error';

export type TEncryptRoomState = {
	state:
		| typeof ENCRYPT_ROOM_STATE_GET_MEMBERS
		| typeof ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY
		| typeof ENCRYPT_ROOM_STATE_ENCRYPTING_USERS
		| typeof ENCRYPT_ROOM_STATE_SET_ROOM_KEY
		| typeof ENCRYPT_ROOM_STATE_SEND_ALIAS_MESSAGE
		| typeof ENCRYPT_ROOM_STATE_DONE
		| typeof ENCRYPT_ROOM_STATE_ERROR;
	count: number;
	total: number;
};

export type e2eeParams = {
	key?: CryptoKey;
	keyID?: string;
	sessionKeyExportedString?: string;
	encrypted?: boolean;
};

export interface UseE2EEParams extends e2eeParams {
	addNewUsersToEncryptedRoom?: (
		onStateChange?: (state: TEncryptRoomState) => void,
		roomId?: string
	) => Promise<void>;
	encryptRoom?: (
		onStateChange?: (state: TEncryptRoomState) => void,
		roomId?: string
	) => Promise<void>;
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
	const { reload: reloadUsersOfRoom } = useContext(
		RocketChatUsersOfRoomContext
	);

	const [keyData, setKeyData] = useState<{
		key: CryptoKey;
		keyID: string;
		sessionKeyExportedString: string;
	}>({
		key: null,
		keyID: null,
		sessionKeyExportedString: null
	});

	const [ready, setReady] = useState(false);

	const [encrypted, setEncrypted] = useState(false);
	const [subscriptionKeyLost, setSubscriptionKeyLost] = useState(false);
	const [roomNotFound, setRoomNotFound] = useState(false);
	const rcUid = getValueFromCookie('rc_uid');

	const keyType = useRef(null);
	const keyIdRef = useRef(null);
	const sessionKeyExportedStringRef = useRef(null);

	const encryptMembers = useCallback(
		async (
			onStateChange?: (state: TEncryptRoomState) => void,
			skipCurrentUser = true,
			generateTmpKeys = false,
			roomId: string = rid
		) => {
			onStateChange &&
				onStateChange({
					state: ENCRYPT_ROOM_STATE_GET_MEMBERS,
					count: 0,
					total: 0
				});

			const usersOfRoom = await reloadUsersOfRoom(roomId);

			// Filter active user skip it
			const filteredMembers = usersOfRoom.filter(
				(member) => !skipCurrentUser || member._id !== rcUid
			);

			let unhandledMembers = filteredMembers.length;
			if (unhandledMembers <= 0) {
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_DONE,
						count: 0,
						total: 0
					});
				return [0, 0];
			}

			onStateChange &&
				onStateChange({
					state: ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY,
					count: filteredMembers.length - unhandledMembers,
					total: filteredMembers.length
				});

			const { users } =
				await apiRocketChatGetUsersOfRoomWithoutKey(roomId);

			if (users.length <= 0) {
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_DONE,
						count: 0,
						total: 0
					});
				return [0, 0];
			}

			onStateChange &&
				onStateChange({
					state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
					count: filteredMembers.length - unhandledMembers,
					total: filteredMembers.length
				});

			await Promise.all(
				filteredMembers.map(async (member) => {
					const user = users.find((user) => user._id === member._id);
					let userKey;
					if (user) {
						userKey = await encryptForParticipant(
							user.e2e.public_key,
							keyData.keyID,
							keyData.sessionKeyExportedString
						);
					} else if (generateTmpKeys) {
						// If user has no public_key encrypt with tmpMasterKey
						const tmpMasterKey = await getTmpMasterKey(member._id);

						userKey =
							'tmp.' +
							keyData.keyID +
							CryptoJS.AES.encrypt(
								keyData.sessionKeyExportedString,
								tmpMasterKey
							);
					} else {
						unhandledMembers--;
						onStateChange &&
							onStateChange({
								state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
								count:
									filteredMembers.length - unhandledMembers,
								total: filteredMembers.length
							});
						return;
					}

					await apiRocketChatUpdateGroupKey(
						member._id,
						roomId,
						userKey
					).then(() => {
						unhandledMembers--;
						onStateChange &&
							onStateChange({
								state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
								count:
									filteredMembers.length - unhandledMembers,
								total: filteredMembers.length
							});
					});
				})
			);

			return [filteredMembers.length, unhandledMembers];
		},
		[
			rid,
			reloadUsersOfRoom,
			rcUid,
			keyData.keyID,
			keyData.sessionKeyExportedString
		]
	);

	const encryptRoom = useCallback(
		async (
			onStateChange?: (state: TEncryptRoomState) => void,
			roomId: string = rid
		) => {
			if (!isE2eeEnabled || encrypted || !roomId) {
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_DONE,
						count: 0,
						total: 0
					});
				return;
			}

			const [members, unhandled] = await encryptMembers(
				onStateChange,
				false,
				true,
				roomId
			);

			// Set Room Key ID at the very end because if something failed before it will still be repairable
			// After room key is set the room is encrypted and the room key could not be set again.
			console.log('Set Room Key ID', roomId, keyData.keyID);
			try {
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_SET_ROOM_KEY,
						count: members - unhandled,
						total: members
					});
				await apiRocketChatSetRoomKeyID(roomId, keyData.keyID);
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_SEND_ALIAS_MESSAGE,
						count: members - unhandled,
						total: members
					});
				await apiSendAliasMessage({
					rcGroupId: roomId,
					type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
				});

				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_DONE,
						count: members - unhandled,
						total: members
					});

				console.log('Start writing encrypted messages!');
			} catch (e) {
				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_ERROR,
						count: members - unhandled,
						total: members
					});
				console.error(e);
			}
		},
		[encryptMembers, encrypted, isE2eeEnabled, keyData.keyID, rid]
	);

	const addNewUsersToEncryptedRoom = useCallback(
		async (onStateChange?: (state: TEncryptRoomState) => void) => {
			try {
				if (!isE2eeEnabled || !encrypted || subscriptionKeyLost) {
					onStateChange &&
						onStateChange({
							state: ENCRYPT_ROOM_STATE_DONE,
							count: 0,
							total: 0
						});
					return;
				}

				const [members, unhandled] =
					await encryptMembers(onStateChange);

				onStateChange &&
					onStateChange({
						state: ENCRYPT_ROOM_STATE_DONE,
						count: members - unhandled,
						total: members
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
		[encryptMembers, encrypted, isE2eeEnabled, subscriptionKeyLost]
	);

	useEffect(() => {
		keyIdRef.current = keyData.keyID;
	}, [keyData.keyID]);

	useEffect(() => {
		sessionKeyExportedStringRef.current = keyData.sessionKeyExportedString;
	}, [keyData.sessionKeyExportedString]);

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
			setKeyData({
				key,
				keyID,
				sessionKeyExportedString
			});
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
				keyType.current = KEY_TYPE_IMPORTED;
				// Generate key with old generation logic for old chats
				// ToDo: Could be removed if no old chats with room.e2eKeyId === 'eyJhbGciOiJB' exists anymore
				const oldE2EKeyId = btoa(sessionKeyExportedString).slice(0, 12);
				setKeyData({
					key,
					keyID:
						currentRoom.e2eKeyId === oldE2EKeyId
							? currentRoom.e2eKeyId
							: keyID,
					sessionKeyExportedString
				});
				setReady(true);
			})
			.catch((e) => {
				console.log(e, rid, subscription.E2EKey);
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
			setKeyData({
				key: null,
				keyID: null,
				sessionKeyExportedString: null
			});
			setReady(false);
		};
	}, [rid]);

	return {
		...keyData,
		encrypted,
		addNewUsersToEncryptedRoom,
		ready,
		subscriptionKeyLost,
		roomNotFound,
		encryptRoom
	};
};
