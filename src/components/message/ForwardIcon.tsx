import * as React from 'react';
import { useState } from 'react';
import { ajaxForwardMessage } from '../apiWrapper/ajaxCallMessageForward';
import { translate } from '../../resources/scripts/i18n/translate';
import { SVG } from '../svgSet/SVG';
import { ICON_KEYS } from '../svgSet/SVGHelpers';

interface ForwardIconProps {
	right: Boolean;
	message: string;
	messageTime: string;
	username: string;
	askerRcId: string;
	groupId: string;
}

export const ForwardIcon = (props: ForwardIconProps) => {
	const [messageForwarded, setMessageForwarded] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const forwardMessage = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);

		ajaxForwardMessage(
			props.message,
			props.messageTime,
			props.username,
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
			<SVG
				name={ICON_KEYS.ARROW_FORWARD}
				className={
					!messageForwarded ? `forward` : `forward forward--active`
				}
			/>
			<SVG
				name={ICON_KEYS.CHECKMARK}
				className={
					!messageForwarded ? `success` : `success success--active`
				}
			/>
		</div>
	);
};
