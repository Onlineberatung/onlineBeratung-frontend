import * as React from 'react';
import { useCallback, useContext, useState } from 'react';

import { apiForwardMessage } from '../../api';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import { encryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';
import { E2EEContext } from '../../globalState';
import { useTranslation } from 'react-i18next';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';
import { useE2EEViewElements } from '../../hooks/useE2EEViewElements';
import { Overlay } from '../overlay/Overlay';
import { useTimeoutOverlay } from '../../hooks/useTimeoutOverlay';
import {
	OVERLAY_E2EE,
	OVERLAY_REQUEST
} from '../../globalState/interfaces/AppConfig/OverlaysConfigInterface';

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
	const { key, keyID, encrypted, encryptRoom } = useE2EE(props.groupId);
	const {
		visible: e2eeOverlayVisible,
		setState: setE2EEState,
		overlay: e2eeOverlay
	} = useE2EEViewElements();

	const { isE2eeEnabled } = useContext(E2EEContext);

	const forwardMessage = useCallback(async () => {
		if (isRequestInProgress) {
			return null;
		}

		setIsRequestInProgress(true);

		if (encrypted && !keyID) {
			console.error("Can't send message without key");
			setIsRequestInProgress(false);
			return null;
		}

		let message = props.message;
		let isEncrypted = isE2eeEnabled;
		try {
			message = await encryptText(message, keyID, key);
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
			message,
			props.messageTime,
			props.displayName,
			props.askerRcId,
			props.groupId,
			isEncrypted
		).then(() => {
			encryptRoom(setE2EEState).then(() => {
				setMessageForwarded(true);
				setTimeout(() => {
					setMessageForwarded(false);
					setIsRequestInProgress(false);
				}, 3000);
			});
		});
	}, [
		isRequestInProgress,
		encrypted,
		props.message,
		props.messageTime,
		props.displayName,
		props.askerRcId,
		props.groupId,
		isE2eeEnabled,
		key,
		keyID,
		encryptRoom,
		setE2EEState
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

			{requestOverlayVisible && (
				<Overlay item={requestOverlay} name={OVERLAY_REQUEST} />
			)}
			{e2eeOverlayVisible && (
				<Overlay item={e2eeOverlay} name={OVERLAY_E2EE} />
			)}
		</div>
	);
};
