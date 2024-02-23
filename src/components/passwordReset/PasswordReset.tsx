import * as React from 'react';
import { useState, useContext } from 'react';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { apiUpdatePassword } from '../../api';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { Button, BUTTON_TYPES } from '../button/Button';
import { logout } from '../logout/logout';
import {
	inputValuesFit,
	strengthIndicator
} from '../../utils/validateInputValue';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import './passwordReset.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import {
	encryptPrivateKey,
	deriveMasterKeyFromPassword
} from '../../utils/encryptionHelpers';
import { apiRocketChatSetUserKeys } from '../../api/apiRocketChatSetUserKeys';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import {
	AUTHORITIES,
	E2EEContext,
	hasUserAuthority,
	UserDataContext
} from '../../globalState';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import { getTenantSettings } from '../../utils/tenantSettingsHelper';
import { apiUpdatePasswordAppointments } from '../../api/apiUpdatePasswordAppointments';

export const PasswordReset = () => {
	const { t: translate } = useTranslation();
	const rcUid = getValueFromCookie('rc_uid');
	const { featureAppointmentsEnabled } = getTenantSettings();
	const { userData } = useContext(UserDataContext);
	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	const settings = useAppConfig();

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
	const [hasMasterKeyError, setHasMasterKeyError] = useState(false);

	const [overlayActive, setOverlayActive] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const { isE2eeEnabled } = useContext(E2EEContext);

	const overlayItem: OverlayItem = {
		svg: CheckIcon,
		headline: translate(
			'profile.functions.password.reset.overlay.headline'
		),
		buttonSet: [
			{
				label: translate(
					'profile.functions.password.reset.overlay.button.label'
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
		label: translate('profile.functions.password.reset.old.label'),
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
		label: translate('profile.functions.password.reset.new.label'),
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
		label: translate('profile.functions.password.reset.confirm.label'),
		infoText:
			confirmPasswordErrorMessage || confirmPasswordSuccessMessage
				? `${confirmPasswordErrorMessage} ${confirmPasswordSuccessMessage}`
				: '',
		content: confirmPassword
	};

	const handleInputOldChange = (event) => {
		setOldPasswordErrorMessage('');
		setHasMasterKeyError(false);
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
				translate('profile.functions.password.reset.insecure')
			);
		} else if (newPassword.length >= 1) {
			setNewPasswordSuccessMessage(
				translate('profile.functions.password.reset.secure')
			);
			setNewPasswordErrorMessage('');
			setHasMasterKeyError(false);
		} else {
			setNewPasswordSuccessMessage('');
			setNewPasswordErrorMessage('');
			setHasMasterKeyError(false);
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
				translate('profile.functions.password.reset.not.same')
			);
		} else if (confirmPassword.length >= 1) {
			setConfirmPasswordSuccessMessage(
				translate('profile.functions.password.reset.same')
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
			setHasMasterKeyError(false);
			setIsRequestInProgress(true);
			setOldPasswordErrorMessage('');

			apiUpdatePassword(oldPassword, newPassword)
				.then(async () => {
					try {
						// always execute reset logic to ensure master key is updated even if E2ee is enabled or not

						// create new masterkey from newPassword
						const newMasterKey = await deriveMasterKeyFromPassword(
							rcUid,
							newPassword
						);

						// encrypt private key with new masterkey
						const encryptedPrivateKey = await encryptPrivateKey(
							sessionStorage.getItem('private_key'),
							newMasterKey
						);

						// save with rocket chat
						await apiRocketChatSetUserKeys(
							sessionStorage.getItem('public_key'),
							encryptedPrivateKey
						);

						isConsultant &&
							featureAppointmentsEnabled &&
							apiUpdatePasswordAppointments(
								userData.email,
								newPassword
							);

						setOverlayActive(true);
						setIsRequestInProgress(false);
						logout(false, settings.urls.toLogin);
					} catch (e) {
						// rechange password to the old password
						await apiUpdatePassword(newPassword, oldPassword).catch(
							() => {
								// if an error happens here we keep the newPassword but don't upgrade the masterKey
								// and hope it works next login attempt
							}
						);
						setHasMasterKeyError(true);

						featureAppointmentsEnabled &&
							apiUpdatePasswordAppointments(
								userData.email,
								oldPassword
							);
					}
				})
				.catch(() => {
					// error handling for password update error
					setOldPasswordErrorMessage(
						translate(
							'profile.functions.password.reset.old.incorrect'
						)
					);
					setIsRequestInProgress(false);
				});
		}
	};

	const handleSuccess = () => {
		window.location.href = settings.urls.toLogin;
	};

	return (
		<div id="passwordReset" className="passwordReset">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.functions.password.reset.title')}
					semanticLevel="5"
				/>
				<Text
					text={translate(
						'profile.functions.password.reset.subtitle'
					)}
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
					className="tertiary pb--1"
					dangerouslySetInnerHTML={{
						__html: translate(
							'profile.functions.password.reset.instructions'
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

				{isE2eeEnabled && hasMasterKeyError && (
					<div className="passwordReset__error">
						{translate('profile.functions.masterKey.saveError')}
					</div>
				)}

				<div className="button__wrapper">
					<Button
						item={{
							label: translate(
								'profile.functions.security.button'
							),
							type: 'LINK'
						}}
						buttonHandle={handleSubmit}
						className={'passwordReset__button'}
						disabled={!isValid}
					/>
				</div>
			</div>
			{overlayActive ? (
				<Overlay item={overlayItem} handleOverlay={handleSuccess} />
			) : null}
		</div>
	);
};
