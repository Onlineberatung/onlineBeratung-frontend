import * as React from 'react';
import { useCallback, useState, useContext } from 'react';
import CryptoJS from 'crypto-js';

import { apiForwardMessage } from '../../api';
import { translate } from '../../utils/translate';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import {
	createGroupKey,
	encryptForParticipant,
	encryptText,
	getTmpMasterKey
} from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { apiRocketChatGroupMembers } from '../../api/apiRocketChatGroupMembers';
import { apiRocketChatGetUsersOfRoomWithoutKey } from '../../api/apiRocketChatGetUsersOfRoomWithoutKey';
import { apiRocketChatUpdateGroupKey } from '../../api/apiRocketChatUpdateGroupKey';
import { apiRocketChatSetRoomKeyID } from '../../api/apiRocketChatSetRoomKeyID';
import {
	ALIAS_MESSAGE_TYPES,
	apiSendAliasMessage
} from '../../api/apiSendAliasMessage';
import { E2EEContext } from '../../globalState';

interface ForwardMessageProps {
	right: Boolean;
	message: string;
	messageTime: string;
	displayName: string;
	askerRcId: string;
	groupId: string;
}

export const ForwardMessage = (props: ForwardMessageProps) => {
	const [messageForwarded, setMessageForwarded] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	/* E2EE */
	const { key, keyID, encrypted, sessionKeyExportedString } = useE2EE(
		props.groupId
	);
	const { refresh } = useContext(E2EEContext);

	const hasE2EEFeatureEnabled = () =>
		localStorage.getItem('e2eeFeatureEnabled') ?? false;

	const encryptRoom = useCallback(
		async (groupKeyID, sessionGroupKeyExportedString) => {
			if (hasE2EEFeatureEnabled() && !encrypted) {
				const { members } = await apiRocketChatGroupMembers(
					props.groupId
				);
				const { users } = await apiRocketChatGetUsersOfRoomWithoutKey(
					props.groupId
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
							const user = users.find(
								(user) => user._id === member._id
							);
							// If user has no public_key encrypt with tmpMasterKey
							const tmpMasterKey = await getTmpMasterKey(
								member._id
							);
							let userKey;
							if (user) {
								userKey = await encryptForParticipant(
									user.e2e.public_key,
									groupKeyID,
									sessionGroupKeyExportedString
								);
							} else {
								userKey =
									'tmp.' +
									groupKeyID +
									CryptoJS.AES.encrypt(
										sessionGroupKeyExportedString,
										tmpMasterKey
									);
							}

							return apiRocketChatUpdateGroupKey(
								member._id,
								props.groupId,
								userKey
							);
						})
				);

				// Set Room Key ID at the very end because if something failed before it will still be repairable
				// After room key is set the room is encrypted and the room key could not be set again.
				console.log('Set Room Key ID', groupKeyID);
				try {
					await apiRocketChatSetRoomKeyID(props.groupId, groupKeyID);
					await apiSendAliasMessage({
						rcGroupId: props.groupId,
						type: ALIAS_MESSAGE_TYPES.E2EE_ACTIVATED
					});
				} catch (e) {
					console.error(e);
					return;
				}

				console.log('Start writing encrypted messages!');
				refresh();
			}
		},
		[refresh, props.groupId, encrypted]
	);

	const forwardMessage = useCallback(async () => {
		let groupKey;
		let groupKeyID;
		let sessionGroupKeyExportedString;

		if (!encrypted) {
			const {
				keyID: newKeyID,
				key: newKey,
				sessionKeyExportedString: newSessionKeyExportedString
			} = await createGroupKey();
			groupKey = newKey;
			groupKeyID = newKeyID;
			sessionGroupKeyExportedString = newSessionKeyExportedString;
		} else {
			groupKey = key;
			groupKeyID = keyID;
			sessionGroupKeyExportedString = sessionKeyExportedString;
		}

		if (isRequestInProgress) {
			return null;
		}

		if (encrypted && !groupKeyID) {
			console.error("Can't send message without key");
			return null;
		}

		setIsRequestInProgress(true);

		apiForwardMessage(
			await encryptText(props.message, groupKeyID, groupKey),
			props.message,
			props.messageTime,
			props.displayName,
			props.askerRcId,
			props.groupId
		).then(() => {
			encryptRoom(groupKeyID, sessionGroupKeyExportedString);
			setMessageForwarded(true);
			setTimeout(() => {
				setMessageForwarded(false);
				setIsRequestInProgress(false);
			}, 3000);
		});
	}, [
		encryptRoom,
		encrypted,
		key,
		keyID,
		sessionKeyExportedString,
		isRequestInProgress,
		props.askerRcId,
		props.displayName,
		props.groupId,
		props.message,
		props.messageTime
	]);

	return (
		<div
			className={
				props.right
					? `messageItem__action messageItem__action--right`
					: `messageItem__action`
			}
			title={translate('message.forward.title')}
			role="button"
			aria-label={translate('message.forward.title')}
			onClick={forwardMessage}
		>
			<ArrowForwardIcon
				className={
					!messageForwarded ? `forward` : `forward forward--active`
				}
			/>
			<CheckmarkIcon
				className={
					!messageForwarded ? `success` : `success success--active`
				}
			/>
		</div>
	);
};
