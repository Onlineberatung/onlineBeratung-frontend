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

interface EncryptRoomProps {
	isE2eeEnabled: boolean;
	isRoomAlreadyEncrypted: boolean;
	rcGroupId: string;
	keyId: string;
	sessionKeyExportedString: string;
}

export const encryptRoom = async ({
	isE2eeEnabled,
	isRoomAlreadyEncrypted,
	rcGroupId,
	keyId,
	sessionKeyExportedString
}: EncryptRoomProps) => {
	if (isE2eeEnabled && !isRoomAlreadyEncrypted) {
		const { members } = await apiRocketChatGroupMembers(rcGroupId);
		const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(
			rcGroupId
		);

		await Promise.all(
			members
				// Filter system user and users with unencrypted username (Maybe more system users)
				.filter(
					(member) =>
						member.username !== 'System' &&
						member.username.indexOf('enc.') === 0
				)
				.map(async (member) => {
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
					);
				})
		);

		// Set Room Key ID at the very end because if something failed before it will still be repairable
		// After room key is set the room is encrypted and the room key could not be set again.
		console.log('Set Room Key ID', rcGroupId, keyId);
		try {
			await apiRocketChatSetRoomKeyID(rcGroupId, keyId);
			await apiSendAliasMessage({
				rcGroupId: rcGroupId,
				type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
			});
		} catch (e) {
			console.error(e);
			return;
		}

		console.log('Start writing encrypted messages!');
	}
};
