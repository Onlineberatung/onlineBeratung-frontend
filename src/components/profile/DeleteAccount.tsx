import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import './deleteAccount.styles';

export const DeleteAccount = () => {
	const [
		deleteAccountOverlayActive,
		setDeleteAccountOverlayActive
	] = useState(false);

	const deleteAccountButton: ButtonItem = {
		label: translate('deleteAccount.button.label'),
		type: BUTTON_TYPES.SECONDARY
	};

	const overlayDeleteAccount: OverlayItem = {
		headline: translate('deleteAccount.confirmOverlay.headline'),
		copy: translate('deleteAccount.confirmOverlay.copy'),
		buttonSet: [
			{
				label: translate('deleteAccount.confirmOverlay.button.confirm'),
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('deleteAccount.confirmOverlay.button.deny'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setDeleteAccountOverlayActive(false);
		}
	};

	return (
		<>
			<div className="deleteAccount">
				<Button
					item={deleteAccountButton}
					buttonHandle={() => setDeleteAccountOverlayActive(true)}
				/>
			</div>
			{deleteAccountOverlayActive && (
				<OverlayWrapper>
					<Overlay
						item={overlayDeleteAccount}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};
