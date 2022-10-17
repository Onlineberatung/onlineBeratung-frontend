import CryptoJS from 'crypto-js';

import { apiRocketChatGetUsersOfRoomWithoutKey } from '../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatGroupMembers } from '../api/apiRocketChatGroupMembers';
import { apiRocketChatSetRoomKeyID } from '../api/apiRocketChatSetRoomKeyID';
import { apiRocketChatUpdateGroupKey } from '../api/apiRocketChatUpdateGroupKey';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../api/apiSendAliasMessage';
import { encryptForParticipant, getTmpMasterKey } from './encryptionHelpers';

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

interface EncryptRoomProps {
	isE2eeEnabled: boolean;
	isRoomAlreadyEncrypted: boolean;
	rcGroupId: string;
	keyId: string;
	sessionKeyExportedString: string;
	onStateChange?: (state: TEncryptRoomState) => void;
}

export const encryptRoom = async ({
	isE2eeEnabled,
	isRoomAlreadyEncrypted,
	rcGroupId,
	keyId,
	sessionKeyExportedString,
	onStateChange
}: EncryptRoomProps) => {
	if (isE2eeEnabled && !isRoomAlreadyEncrypted) {
		onStateChange &&
			onStateChange({
				state: ENCRYPT_ROOM_STATE_GET_MEMBERS,
				count: 0,
				total: 0
			});

		const { members } = await apiRocketChatGroupMembers(rcGroupId);
		// Filter system user and users with unencrypted username (Maybe more system users)
		const filteredMembers = members.filter(
			(member) =>
				member.username !== 'System' &&
				member.username.indexOf('enc.') === 0
		);

		let unhandledMembers = filteredMembers.length;
		onStateChange &&
			onStateChange({
				state: ENCRYPT_ROOM_STATE_GET_USERS_WITHOUT_KEY,
				count: filteredMembers.length - unhandledMembers,
				total: filteredMembers.length
			});

		const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(
			rcGroupId
		);

		onStateChange &&
			onStateChange({
				state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
				count: filteredMembers.length - unhandledMembers,
				total: filteredMembers.length
			});

		await Promise.all(
			filteredMembers.map(async (member) => {
				const user = users.find((user) => user._id === member._id);
				// If user has no public_key encrypt with tmpMasterKey
				const tmpMasterKey = await getTmpMasterKey(member._id);
				let userKey;
				if (user) {
					userKey = await encryptForParticipant(
						user.e2e.public_key,
						keyId,
						sessionKeyExportedString
					);
				} else {
					userKey =
						'tmp.' +
						keyId +
						CryptoJS.AES.encrypt(
							sessionKeyExportedString,
							tmpMasterKey
						);
				}

				return apiRocketChatUpdateGroupKey(
					member._id,
					rcGroupId,
					userKey
				).then(() => {
					unhandledMembers--;
					onStateChange &&
						onStateChange({
							state: ENCRYPT_ROOM_STATE_ENCRYPTING_USERS,
							count: filteredMembers.length - unhandledMembers,
							total: filteredMembers.length
						});
				});
			})
		);

		// Set Room Key ID at the very end because if something failed before it will still be repairable
		// After room key is set the room is encrypted and the room key could not be set again.
		console.log('Set Room Key ID', rcGroupId, keyId);
		try {
			onStateChange &&
				onStateChange({
					state: ENCRYPT_ROOM_STATE_SET_ROOM_KEY,
					count: filteredMembers.length - unhandledMembers,
					total: filteredMembers.length
				});
			await apiRocketChatSetRoomKeyID(rcGroupId, keyId);
			onStateChange &&
				onStateChange({
					state: ENCRYPT_ROOM_STATE_SEND_ALIAS_MESSAGE,
					count: filteredMembers.length - unhandledMembers,
					total: filteredMembers.length
				});
			await apiSendAliasMessage({
				rcGroupId: rcGroupId,
				type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
			});
		} catch (e) {
			onStateChange &&
				onStateChange({
					state: ENCRYPT_ROOM_STATE_ERROR,
					count: filteredMembers.length - unhandledMembers,
					total: filteredMembers.length
				});
			console.error(e);
			return;
		}

		onStateChange &&
			onStateChange({
				state: ENCRYPT_ROOM_STATE_DONE,
				count: filteredMembers.length - unhandledMembers,
				total: filteredMembers.length
			});

		console.log('Start writing encrypted messages!');
		return;
	}

	onStateChange &&
		onStateChange({
			state: ENCRYPT_ROOM_STATE_DONE,
			count: 0,
			total: 0
		});
};
