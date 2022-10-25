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
import { useE2EEViewElements } from '../../hooks/useE2EEViewElements';
import { Overlay, OverlayWrapper } from '../overlay/Overlay';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';

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

	const { visible: requestOverlayVisible, overlay: requestOverlay } =
		useTimeoutOverlay(isRequestInProgress);

	/* E2EE */
	const { key, keyID, encrypted, sessionKeyExportedString } = useE2EE(
		props.groupId
	);
	const {
		visible: e2eeOverlayVisible,
		setState: setE2EEState,
		overlay: e2eeOverlay
	} = useE2EEViewElements();

	const { isE2eeEnabled } = useContext(E2EEContext);

	const encryptForwardRoom = useCallback(
		(groupKeyID, sessionGroupKeyExportedString) =>
			encryptRoom({
				keyId: groupKeyID,
				isE2eeEnabled,
				isRoomAlreadyEncrypted: encrypted,
				rcGroupId: props.groupId,
				sessionKeyExportedString: sessionGroupKeyExportedString,
				onStateChange: setE2EEState
			}),
		[isE2eeEnabled, encrypted, props.groupId, setE2EEState]
	);

	const forwardMessage = useCallback(async () => {
		let groupKey;
		let groupKeyID;
		let sessionGroupKeyExportedString;

		if (isRequestInProgress) {
			return null;
		}

		setIsRequestInProgress(true);

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

		if (encrypted && !groupKeyID) {
			console.error("Can't send message without key");
			setIsRequestInProgress(false);
			return null;
		}

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
			encryptForwardRoom(groupKeyID, sessionGroupKeyExportedString).then(
				() => {
					setMessageForwarded(true);
					setTimeout(() => {
						setMessageForwarded(false);
						setIsRequestInProgress(false);
					}, 3000);
				}
			);
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

			{requestOverlayVisible && !e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay item={requestOverlay} />
				</OverlayWrapper>
			)}

			{e2eeOverlayVisible && (
				<OverlayWrapper>
					<Overlay item={e2eeOverlay} />
				</OverlayWrapper>
			)}
		</div>
	);
};
