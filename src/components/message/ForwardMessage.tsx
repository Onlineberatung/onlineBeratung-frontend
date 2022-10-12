import * as React from 'react';
import { useCallback, useState, useContext } from 'react';

import { apiForwardMessage } from '../../api';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import { createGroupKey, encryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { E2EEContext } from '../../globalState';
import { encryptRoom } from '../../utils/e2eeHelper';
import { useTranslation } from 'react-i18next';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';

interface ForwardMessageProps {
	right: boolean;
	message: string;
	messageTime: string;
	displayName: string;
	askerRcId: string;
	groupId: string;
}

export const ForwardMessage = (props: ForwardMessageProps) => {
	const { t: translate } = useTranslation();
	const [messageForwarded, setMessageForwarded] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	/* E2EE */
	const { key, keyID, encrypted, sessionKeyExportedString } = useE2EE(
		props.groupId
	);
	const { isE2eeEnabled } = useContext(E2EEContext);

	const encryptForwardRoom = useCallback(
		async (groupKeyID, sessionGroupKeyExportedString) => {
			await encryptRoom({
				keyId: groupKeyID,
				isE2eeEnabled,
				isRoomAlreadyEncrypted: encrypted,
				rcGroupId: props.groupId,
				sessionKeyExportedString: sessionGroupKeyExportedString
			});
		},
		[props.groupId, encrypted, isE2eeEnabled]
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

		let encryptedMessage = props.message;
		let isEncrypted = isE2eeEnabled;
		try {
			encryptedMessage = await encryptText(
				encryptedMessage,
				groupKeyID,
				groupKey
			);
		} catch (e: any) {
			apiPostError({
				name: e.name,
				message: e.message,
				stack: e.stack,
				level: ERROR_LEVEL_WARN
			}).then();

			isEncrypted = false;
		}

		apiForwardMessage(
			encryptedMessage,
			props.message,
			props.messageTime,
			props.displayName,
			props.askerRcId,
			props.groupId,
			isEncrypted
		).then(() => {
			encryptForwardRoom(groupKeyID, sessionGroupKeyExportedString);
			setMessageForwarded(true);
			setTimeout(() => {
				setMessageForwarded(false);
				setIsRequestInProgress(false);
			}, 3000);
		});
	}, [
		isE2eeEnabled,
		encryptForwardRoom,
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
