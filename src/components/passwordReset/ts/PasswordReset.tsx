import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { InputField, InputFieldItem } from '../../inputField/ts/InputField';
import {
	strengthIndicator,
	inputValuesFit
} from '../../passwordField/ts/validateInputValue';
import { updatePassword } from '../../apiWrapper/ts/ajaxCallPasswordReset';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../../overlay/ts/Overlay';
import { BUTTON_TYPES } from '../../button/ts/Button';
import { config } from '../../../resources/ts/config';
import { logout } from '../../logout/ts/logout';

export const PasswordReset = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState('');
	const [oldPasswordSuccessMessage, setOldPasswordSuccessMessage] = useState(
		''
	);
	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
	const [newPasswordSuccessMessage, setNewPasswordSuccessMessage] = useState(
		''
	);
	const [
		confirmPasswordErrorMessage,
		setConfirmPasswordErrorMessage
	] = useState('');
	const [
		confirmPasswordSuccessMessage,
		setConfirmPasswordSuccessMessage
	] = useState('');

	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const overlayItem: OverlayItem = {
		imgSrc: '/../resources/img/illustrations/check.svg',
		headline: translate('profile.functions.passwordReset.overlay.headline'),
		buttonSet: [
			{
				label: translate(
					'profile.functions.passwordReset.overlay.buttonLabel'
				),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const getClassNames = (invalid, valid) => {
		let classNames = ['passwordReset__input'];
		if (invalid) {
			classNames.push('passwordReset__input--red');
		}
		if (valid) {
			classNames.push('passwordReset__input--green');
		}
		return classNames.join(' ');
	};

	const inputOldPassword: InputFieldItem = {
		name: 'passwordResetOld',
		class: getClassNames(
			!!oldPasswordErrorMessage,
			!!oldPasswordSuccessMessage
		),
		id: 'passwordResetOld',
		type: 'password',
		labelTranslatable: 'profile.functions.passwordResetOldLabel',
		infoText:
			oldPasswordErrorMessage || oldPasswordSuccessMessage
				? `${oldPasswordErrorMessage} ${oldPasswordSuccessMessage}`
				: '',
		content: oldPassword
	};

	const inputNewPassword: InputFieldItem = {
		name: 'passwordResetNew',
		class: getClassNames(
			!!newPasswordErrorMessage,
			!!newPasswordSuccessMessage
		),
		id: 'passwordResetNew',
		type: 'password',
		labelTranslatable: 'profile.functions.passwordResetNewLabel',
		infoText:
			(newPasswordErrorMessage || newPasswordSuccessMessage
				? `${newPasswordErrorMessage} ${newPasswordSuccessMessage}<br>`
				: '') +
			translate('profile.functions.passwordResetInstructions'),
		content: newPassword
	};

	const inputConfirmPassword: InputFieldItem = {
		name: 'passwordResetConfirm',
		class: getClassNames(
			!!confirmPasswordErrorMessage,
			!!confirmPasswordSuccessMessage
		),
		id: 'passwordResetConfirm',
		type: 'password',
		labelTranslatable: 'profile.functions.passwordResetConfirmLabel',
		infoText:
			confirmPasswordErrorMessage || confirmPasswordSuccessMessage
				? `${confirmPasswordErrorMessage} ${confirmPasswordSuccessMessage}`
				: '',
		content: confirmPassword
	};

	const handleInputOldChange = (event) => {
		validateOldPassword(event.target.value);
		setOldPassword(event.target.value);
	};

	const handleInputNewChange = (event) => {
		validateNewPassword(event.target.value);
		setNewPassword(event.target.value);
	};

	const handleInputConfirmChange = (event) => {
		validateConfirmPassword(event.target.value);
		setConfirmPassword(event.target.value);
	};

	const validateOldPassword = (oldPW) => {
		setOldPasswordErrorMessage('');
	};

	const validateNewPassword = (newPw) => {
		let passwordStrength = strengthIndicator(newPw);
		if (newPw.length >= 1 && passwordStrength < 4) {
			setNewPasswordSuccessMessage('');
			setNewPasswordErrorMessage(
				translate('profile.functions.passwordResetInsecure')
			);
		} else if (newPw.length >= 1) {
			setNewPasswordSuccessMessage(
				translate('profile.functions.passwordResetSecure')
			);
			setNewPasswordErrorMessage('');
		} else {
			setNewPasswordSuccessMessage('');
			setNewPasswordErrorMessage('');
		}
	};

	const isValid =
		!(!!newPasswordErrorMessage && !!confirmPasswordErrorMessage) &&
		!!newPasswordSuccessMessage &&
		!!confirmPasswordSuccessMessage;

	const validateConfirmPassword = (confirmPw) => {
		let passwordFits = inputValuesFit(confirmPw, newPassword);
		if (confirmPw.length >= 1 && !passwordFits) {
			setConfirmPasswordSuccessMessage('');
			setConfirmPasswordErrorMessage(
				translate('profile.functions.passwordResetNotSame')
			);
		} else if (confirmPw.length >= 1) {
			setConfirmPasswordSuccessMessage(
				translate('profile.functions.passwordResetSame')
			);
			setConfirmPasswordErrorMessage('');
		} else {
			setConfirmPasswordSuccessMessage('');
			setConfirmPasswordErrorMessage('');
		}
	};

	const handleSubmit = () => {
		if (isRequestInProgress) {
			return null;
		}
		if (isValid) {
			setIsRequestInProgress(true);
			setOldPasswordErrorMessage('');
			updatePassword(oldPassword, newPassword)
				.then(() => {
					setOverlayActive(true);
					setIsRequestInProgress(false);
					logout(false, config.endpoints.logoutRedirect);
				})
				.catch(() => {
					setOldPasswordErrorMessage(
						translate('profile.functions.passwordResetOldIncorrect')
					);
					setIsRequestInProgress(false);
				});
		}
	};

	const handleSuccess = () => {
		window.location.href = config.endpoints.logoutRedirect;
	};

	return (
		<div id="passwordReset" className="passwordReset">
			<p className="passwordReset__title profile__content__subtitle">
				{translate('profile.functions.passwordResetTitle')}
			</p>
			<p className="passwordReset__subtitle">
				{translate('profile.functions.passwordResetSubtitle')}
			</p>
			<div className="generalInformation">
				<div className="generalInformation__innerWrapper">
					<InputField
						item={inputOldPassword}
						inputHandle={handleInputOldChange}
					/>
				</div>
				<div className="generalInformation__innerWrapper">
					<InputField
						item={inputNewPassword}
						inputHandle={handleInputNewChange}
					/>
				</div>
				<div className="generalInformation__innerWrapper">
					<InputField
						item={inputConfirmPassword}
						inputHandle={handleInputConfirmChange}
					/>
				</div>
				<div className="button__wrapper">
					<span
						onClick={handleSubmit}
						id="passwordResetButton"
						role="button"
						className={
							'passwordReset__button' +
							(!isValid ? ' passwordReset__button--disabled' : '')
						}
					>
						{translate('profile.functions.securityButton')}
					</span>
				</div>
			</div>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay item={overlayItem} handleOverlay={handleSuccess} />
				</OverlayWrapper>
			) : null}
		</div>
	);
};
