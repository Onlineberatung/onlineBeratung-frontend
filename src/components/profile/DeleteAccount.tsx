import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../resources/scripts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { InputField, InputFieldItem } from '../inputField/InputField';
import {
	OverlayWrapper,
	Overlay,
	OverlayItem,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import './deleteAccount.styles';
import { ReactComponent as CheckIllustration } from '../../resources/img/illustrations/check.svg';

export const DeleteAccount = () => {
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);

	const deleteAccountButton: ButtonItem = {
		label: translate('deleteAccount.button.label'),
		type: BUTTON_TYPES.SECONDARY
	};

	const inputItemPassword: InputFieldItem = {
		name: 'password',
		class: 'passwordFields__fieldGroup__input',
		id: 'passwordInput',
		type: 'password',
		label: translate('login.password.label'),
		content: password
	};

	const overlayConfirm: OverlayItem = {
		headline: translate('deleteAccount.confirmOverlay.headline'),
		headlineStyleLevel: '1',
		copy: translate('deleteAccount.confirmOverlay.copy'),
		nestedComponent: (
			<InputField
				item={inputItemPassword}
				inputHandle={(e) => setPassword(e.target.value)}
			/>
		),
		buttonSet: [
			{
				label: translate('deleteAccount.confirmOverlay.button.confirm'),
				function: OVERLAY_FUNCTIONS.DELETE_ACCOUNT,
				type: BUTTON_TYPES.PRIMARY,
				disabled: password.length === 0
			},
			{
				label: translate('deleteAccount.confirmOverlay.button.deny'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const overlaySuccess: OverlayItem = {
		headline: translate('deleteAccount.successOverlay.headline'),
		headlineStyleLevel: '3',
		svg: CheckIllustration,
		buttonSet: [
			{
				label: 'schließen',
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.DELETE_ACCOUNT) {
			setIsSuccessOverlay(true);
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			//TO-DO: need to logout first?
			window.location.href = 'https://www.caritas.de';
		}
	};

	return (
		<>
			<div className="deleteAccount">
				<Button
					item={deleteAccountButton}
					buttonHandle={() => setIsOverlayActive(true)}
				/>
			</div>
			{isOverlayActive && (
				<OverlayWrapper>
					<Overlay
						item={
							isSuccessOverlay ? overlaySuccess : overlayConfirm
						}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};
