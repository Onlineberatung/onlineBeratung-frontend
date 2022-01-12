import '../../polyfill';
import * as React from 'react';
import { translate } from '../../utils/translate';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { ComponentType, useState, useEffect } from 'react';
import { config } from '../../resources/scripts/config';
import { ButtonItem, Button, BUTTON_TYPES } from '../button/Button';
import { autoLogin } from '../registration/autoLogin';
import { Text } from '../text/Text';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { ReactComponent as VerifiedIcon } from '../../resources/img/icons/verified.svg';
import { StageProps } from '../stage/stage';
import { StageLayout } from '../stageLayout/StageLayout';
import { FETCH_ERRORS } from '../../api';
import { OTP_LENGTH } from '../profile/TwoFactorAuth';
import clsx from 'clsx';
import '../../resources/styles/styles';
import './login.styles';
import { LegalInformationLinksProps } from './LegalInformationLinks';

const loginButton: ButtonItem = {
	label: translate('login.button.label'),
	type: BUTTON_TYPES.PRIMARY
};

interface LoginProps {
	legalComponent: ComponentType<LegalInformationLinksProps>;
	stageComponent: ComponentType<StageProps>;
	showAnimation?: boolean;
}

export const Login = ({
	legalComponent,
	stageComponent: Stage,
	showAnimation = true
}: LoginProps) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(
		username.length > 0 && password.length > 0
	);
	const [otp, setOtp] = useState<string>('');
	const [isOtpRequired, setIsOtpRequired] = useState<boolean>(false);
	const [showLoginError, setShowLoginError] = useState<string>('');
	const [isRequestInProgress, setIsRequestInProgress] =
		useState<boolean>(false);

	useEffect(() => {
		setShowLoginError('');
		if (
			(!isOtpRequired && username && password) ||
			(isOtpRequired && username && password && otp)
		) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [username, password, otp, isOtpRequired]);

	useEffect(() => {
		setOtp('');
		setIsOtpRequired(false);
	}, [username]);

	const inputItemUsername: InputFieldItem = {
		name: 'username',
		class: 'login',
		id: 'username',
		type: 'text',
		label: translate('login.user.label'),
		content: username,
		icon: <PersonIcon />
	};

	const inputItemPassword: InputFieldItem = {
		name: 'password',
		id: 'passwordInput',
		type: 'password',
		label: translate('login.password.label'),
		content: password,
		icon: <LockIcon />
	};

	const otpInputItem: InputFieldItem = {
		content: otp,
		id: 'otp',
		infoText: translate('login.warning.failed.otp.missing'),
		label: translate('twoFactorAuth.activate.step3.input.label'),
		name: 'otp',
		type: 'text',
		icon: <VerifiedIcon />,
		maxLength: OTP_LENGTH
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleOtpChange = (event) => {
		setOtp(event.target.value);
	};

	const handleLogin = () => {
		if (!isRequestInProgress && !isOtpRequired && username && password) {
			setIsRequestInProgress(true);
			autoLogin({
				username: username,
				password: password,
				redirect: true
			})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.UNAUTHORIZED) {
						setShowLoginError(
							translate('login.warning.failed.unauthorized')
						);
					} else if (error.message === FETCH_ERRORS.BAD_REQUEST) {
						setIsOtpRequired(true);
					}
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		} else if (
			!isRequestInProgress &&
			isOtpRequired &&
			username &&
			password &&
			otp
		) {
			setIsRequestInProgress(true);
			autoLogin({
				username,
				password,
				redirect: true,
				otp
			})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.UNAUTHORIZED) {
						setShowLoginError(
							translate('login.warning.failed.unauthorized.otp')
						);
					}
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		}
	};

	const handleKeyUp = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	return (
		<StageLayout
			legalComponent={legalComponent}
			stage={<Stage hasAnimation={showAnimation} />}
			showLegalLinks
		>
			<div className="loginForm">
				<div className="loginForm__headline">
					<h1>{translate('login.headline')}</h1>
				</div>
				<InputField
					item={inputItemUsername}
					inputHandle={handleUsernameChange}
					keyUpHandle={handleKeyUp}
				/>
				<InputField
					item={inputItemPassword}
					inputHandle={handlePasswordChange}
					keyUpHandle={handleKeyUp}
				/>
				<div
					className={clsx('loginForm__otp', {
						'loginForm__otp--active': isOtpRequired
					})}
				>
					<InputField
						item={otpInputItem}
						inputHandle={handleOtpChange}
						keyUpHandle={handleKeyUp}
					/>
				</div>
				{showLoginError && (
					<Text
						text={showLoginError}
						type="infoSmall"
						className="loginForm__error"
					/>
				)}
				<a
					href={config.endpoints.loginResetPasswordLink}
					target="_blank"
					rel="noreferrer"
					className="loginForm__passwordReset"
				>
					{translate('login.resetPasswort.label')}
				</a>
				<Button
					item={loginButton}
					buttonHandle={handleLogin}
					disabled={isButtonDisabled}
				/>
				<div className="loginForm__register">
					<Text
						text={translate('login.register.infoText.title')}
						type={'infoSmall'}
					/>
					<Text
						text={translate('login.register.infoText.copy')}
						type={'infoSmall'}
					/>
					<a
						className="loginForm__register__link"
						href={config.urls.loginRedirectToRegistrationOverview}
						target="_self"
					>
						{translate('login.register.linkLabel')}
					</a>
				</div>
			</div>
		</StageLayout>
	);
};
