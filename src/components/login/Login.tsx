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
import { StageProps } from '../stage/stage';
import { StageLayout } from '../stageLayout/StageLayout';
import '../../resources/styles/styles';
import './login.styles';
import useLoadTenantThemeFiles from '../../utils/useLoadTenantThemeFiles';

const loginButton: ButtonItem = {
	label: translate('login.button.label'),
	type: BUTTON_TYPES.PRIMARY
};

interface LoginProps {
	stageComponent: ComponentType<StageProps>;
}

export const Login = ({ stageComponent: Stage }: LoginProps) => {
	useLoadTenantThemeFiles();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isButtonDisabled, setIsButtonDisabled] = useState(
		username.length > 0 && password.length > 0
	);
	const [showLoginError, setShowLoginError] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	useEffect(() => {
		setShowLoginError(false);
		if (username && password) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [username, password]);

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

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleLoginError = () => {
		setShowLoginError(true);
		setIsRequestInProgress(false);
	};

	const handleLogin = () => {
		if (!isRequestInProgress && username && password) {
			setIsRequestInProgress(true);
			autoLogin({ username, password, redirect: true, handleLoginError });
		}
	};

	const handleKeyUp = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	return (
		<StageLayout stage={<Stage hasAnimation />} showLegalLinks>
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
				{showLoginError ? (
					<Text
						text={translate('login.warning.failed')}
						type="infoSmall"
						className="loginForm__error"
					/>
				) : null}
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
