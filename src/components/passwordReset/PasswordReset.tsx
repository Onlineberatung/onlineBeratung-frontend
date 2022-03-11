import * as React from 'react';
import { useState } from 'react';
import { translate } from '../../utils/translate';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { apiUpdatePassword } from '../../api';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS,
	OverlayItem
} from '../overlay//Overlay';
import { BUTTON_TYPES } from '../button/Button';
import { config } from '../../resources/scripts/config';
import { logout } from '../logout/logout';
import {
	inputValuesFit,
	strengthIndicator
} from '../../utils/validateInputValue';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import './passwordReset.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

export const PasswordReset = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState('');
	const [oldPasswordSuccessMessage] = useState('');
	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
	const [newPasswordSuccessMessage, setNewPasswordSuccessMessage] =
		useState('');
	const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
		useState('');
	const [confirmPasswordSuccessMessage, setConfirmPasswordSuccessMessage] =
		useState('');

	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const overlayItem: OverlayItem = {
		svg: CheckIcon,
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
		label: translate('profile.functions.passwordResetOldLabel'),
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
		label: translate('profile.functions.passwordResetNewLabel'),
		infoText:
			newPasswordErrorMessage || newPasswordSuccessMessage
				? `${newPasswordErrorMessage} ${newPasswordSuccessMessage}<br>`
				: '',
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
		label: translate('profile.functions.passwordResetConfirmLabel'),
		infoText:
			confirmPasswordErrorMessage || confirmPasswordSuccessMessage
				? `${confirmPasswordErrorMessage} ${confirmPasswordSuccessMessage}`
				: '',
		content: confirmPassword
	};

	const handleInputOldChange = (event) => {
		setOldPasswordErrorMessage('');
		setOldPassword(event.target.value);
	};

	const handleInputNewChange = (event) => {
		validateNewPassword(event.target.value);
		validateConfirmPassword(confirmPassword, event.target.value);
		setNewPassword(event.target.value);
	};

	const handleInputConfirmChange = (event) => {
		validateConfirmPassword(event.target.value, newPassword);
		setConfirmPassword(event.target.value);
	};

	const validateNewPassword = (newPassword: string) => {
		let passwordStrength = strengthIndicator(newPassword);
		if (newPassword.length >= 1 && passwordStrength < 4) {
			setNewPasswordSuccessMessage('');
			setNewPasswordErrorMessage(
				translate('profile.functions.passwordResetInsecure')
			);
		} else if (newPassword.length >= 1) {
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

	const validateConfirmPassword = (
		confirmPassword: string,
		newPassword: string
	) => {
		let passwordFits = inputValuesFit(confirmPassword, newPassword);
		if (confirmPassword.length >= 1 && !passwordFits) {
			setConfirmPasswordSuccessMessage('');
			setConfirmPasswordErrorMessage(
				translate('profile.functions.passwordResetNotSame')
			);
		} else if (confirmPassword.length >= 1) {
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
			apiUpdatePassword(oldPassword, newPassword)
				.then(() => {
					setOverlayActive(true);
					setIsRequestInProgress(false);
					logout(false, config.urls.toLogin);
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
		window.location.href = config.urls.toLogin;
	};

	return (
		<div id="passwordReset" className="passwordReset">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.functions.passwordResetTitle')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.functions.passwordResetSubtitle')}
					type="standard"
					className="tertiary"
				/>
			</div>
			<div className="generalInformation">
				<div className="flex">
					<div className="flex__col--1 flex-xl__col--50p">
						<div className="pr-xl--1">
							<InputField
								item={inputOldPassword}
								inputHandle={handleInputOldChange}
							/>
						</div>
					</div>
				</div>

				<div
					className="text--tertiary tertiary pb--1"
					dangerouslySetInnerHTML={{
						__html: translate(
							'profile.functions.passwordResetInstructions'
						)
					}}
				></div>

				<div className="flex flex--fd-column flex-xl--fd-row">
					<div className="flex__col">
						<div className="pr-xl--1">
							<InputField
								item={inputNewPassword}
								inputHandle={handleInputNewChange}
							/>
						</div>
					</div>
					<div className="flex__col">
						<div className="pl-xl--1">
							<InputField
								item={inputConfirmPassword}
								inputHandle={handleInputConfirmChange}
							/>
						</div>
					</div>
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
