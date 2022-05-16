import * as React from 'react';
import { useState } from 'react';
import { apiForwardMessage } from '../../api';
import { translate } from '../../utils/translate';
import { ReactComponent as ArrowForwardIcon } from '../../resources/img/icons/arrow-forward.svg';
import { ReactComponent as CheckmarkIcon } from '../../resources/img/icons/checkmark.svg';
import { encryptText } from '../../utils/encryptionHelpers';
import { useE2EE } from '../../hooks/useE2EE';

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

	const { key, keyID, encrypted } = useE2EE(props.groupId);

	const forwardMessage = async () => {
		if (isRequestInProgress) {
			return null;
		}

		if (encrypted && !keyID) {
			console.error("Can't send message without key");
			return null;
		}

		setIsRequestInProgress(true);

		apiForwardMessage(
			await encryptText(props.message, keyID, key),
			props.messageTime,
			props.displayName,
			props.askerRcId,
			props.groupId
		).then(() => {
			setMessageForwarded(true);
			setTimeout(() => {
				setMessageForwarded(false);
				setIsRequestInProgress(false);
			}, 3000);
		});
	};

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
