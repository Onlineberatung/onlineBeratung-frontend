import * as React from 'react';
import { useState } from 'react';
import { apiUpdatePassword } from '../../api';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { Button, BUTTON_TYPES } from '../button/Button';
import { logout } from '../logout/logout';
import {
	inputValuesFit,
	strengthIndicator
} from '../../utils/validateInputValue';
import CheckIcon from '../../resources/img/illustrations/check.svg?react';
import './passwordReset.styles.scss';
import { Headline } from '../headline/Headline';
import {
	encryptPrivateKey,
	deriveMasterKeyFromPassword
} from '../../utils/encryptionHelpers';
import { apiRocketChatSetUserKeys } from '../../api/apiRocketChatSetUserKeys';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import { Box as MuiBox, Stack, Typography, TextField } from '@mui/material';

export const PasswordReset = () => {
	const { t: translate } = useTranslation();
	const rcUid = getValueFromCookie('rc_uid');

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
		<MuiBox id="passwordReset">
			<Stack spacing={2}>
				<Headline
					text={translate('profile.functions.password.reset.title')}
					semanticLevel="5"
				/>
				<Typography variant="body2" color="text.secondary">
					{translate('profile.functions.password.reset.subtitle')}
				</Typography>

				<TextField
					id="passwordResetOld"
					name="passwordResetOld"
					label={translate('profile.functions.password.reset.old.label')}
					type="password"
					value={oldPassword}
					onChange={handleInputOldChange}
					error={!!oldPasswordErrorMessage}
					helperText={oldPasswordErrorMessage || oldPasswordSuccessMessage || ''}
					fullWidth
					variant="outlined"
					autoComplete="current-password"
				/>

				<Typography 
					variant="body2" 
					color="text.secondary"
					dangerouslySetInnerHTML={{
						__html: translate(
							'profile.functions.password.reset.instructions'
						)
					}}
				/>

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
					<TextField
						id="passwordResetNew"
						name="passwordResetNew"
						label={translate('profile.functions.password.reset.new.label')}
						type="password"
						value={newPassword}
						onChange={handleInputNewChange}
						error={!!newPasswordErrorMessage}
						helperText={newPasswordErrorMessage || newPasswordSuccessMessage || ''}
						fullWidth
						variant="outlined"
						autoComplete="new-password"
					/>
					<TextField
						id="passwordResetConfirm"
						name="passwordResetConfirm"
						label={translate('profile.functions.password.reset.confirm.label')}
						type="password"
						value={confirmPassword}
						onChange={handleInputConfirmChange}
						error={!!confirmPasswordErrorMessage}
						helperText={confirmPasswordErrorMessage || confirmPasswordSuccessMessage || ''}
						fullWidth
						variant="outlined"
						autoComplete="new-password"
					/>
				</Stack>

				{hasMasterKeyError && (
					<Typography variant="body2" color="error">
						{translate('profile.functions.masterKey.saveError')}
					</Typography>
				)}

				<Stack direction="row" justifyContent="flex-end">
					<Button
						item={{
							label: translate(
								'profile.functions.security.button'
							),
							type: BUTTON_TYPES.PRIMARY
						}}
						buttonHandle={handleSubmit}
						disabled={!isValid}
					/>
				</Stack>
			</Stack>

			{overlayActive ? (
				<Overlay item={overlayItem} handleOverlay={handleSuccess} />
			) : null}
		</MuiBox>
	);
};
