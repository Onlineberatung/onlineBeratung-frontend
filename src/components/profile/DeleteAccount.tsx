import * as React from 'react';
import { useState } from 'react';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { Overlay, OverlayItem, OVERLAY_FUNCTIONS } from '../overlay/Overlay';
import './deleteAccount.styles';
import { ReactComponent as CheckIllustration } from '../../resources/img/illustrations/check.svg';
import { apiDeleteAskerAccount, FETCH_ERRORS } from '../../api';
import { removeAllCookies } from '../sessionCookie/accessSessionCookie';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

export const DeleteAccount = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();

	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const [isPasswordWarningActive, setIsPasswordWarningActive] =
		useState<boolean>(false);
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);

	const deleteAccountButton: ButtonItem = {
		label: translate('deleteAccount.button.label'),
		type: BUTTON_TYPES.SECONDARY
	};

	const inputItemPassword: InputFieldItem = {
		name: 'password',
		class: 'passwordFields__fieldGroup__input',
		id: 'passwordInput',
		type: 'password',
		label: translate('deleteAccount.confirmOverlay.input.label'),
		content: password,
		warningLabel: translate('deleteAccount.confirmOverlay.input.warning'),
		warningActive: isPasswordWarningActive
	};

	const handlePasswordInput = (e) => {
		setPassword(e.target.value);
		setIsPasswordWarningActive(false);
	};

	const overlayConfirm: OverlayItem = {
		headline: translate('deleteAccount.confirmOverlay.headline'),
		headlineStyleLevel: '1',
		copy: translate('deleteAccount.confirmOverlay.copy'),
		nestedComponent: (
			<>
				<InputField
					item={inputItemPassword}
					inputHandle={handlePasswordInput}
				/>

				{isPasswordWarningActive && (
					<span className="deleteAccount__warning">
						{translate(
							'deleteAccount.confirmOverlay.input.warning'
						)}
					</span>
				)}
			</>
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
		svg: CheckIllustration,
		buttonSet: [
			{
				label: translate('deleteAccount.successOverlay.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
		} else if (
			!isRequestInProgress &&
			buttonFunction === OVERLAY_FUNCTIONS.DELETE_ACCOUNT
		) {
			setIsRequestInProgress(true);
			apiDeleteAskerAccount(password)
				.then(() => {
					setIsSuccessOverlay(true);
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.BAD_REQUEST) {
						setIsPasswordWarningActive(true);
						setIsRequestInProgress(false);
					}
				});
		} else if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			removeAllCookies();
			window.location.href = settings.urls.home;
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
				<Overlay
					className="deleteAccount__overlay"
					item={isSuccessOverlay ? overlaySuccess : overlayConfirm}
					handleOverlay={handleOverlayAction}
				/>
			)}
		</>
	);
};
