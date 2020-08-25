import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../../stage/ts/stage';
import { translate } from '../../../resources/ts/i18n/translate';
import { InputField, InputFieldItemTSX } from '../../inputField/ts/InputField';
import { useState, useEffect } from 'react';
import { config } from '../../../resources/ts/config';
import { ButtonItem, Button, BUTTON_TYPES } from '../../button/ts/Button';
import { autoLogin } from '../../registrationFormular/ts/autoLogin';
import { ICON_KEYS, Icon } from '../../iconSet/ts/Icon';

export const initLogin = () => {
	ReactDOM.render(<Login />, document.getElementById('loginRoot'));
};

const loginButton: ButtonItem = {
	label: translate('login.button.label'),
	type: BUTTON_TYPES.PRIMARY
};

const Login = () => {
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [showLoginError, setShowLoginError] = useState(false);

	useEffect(() => {
		setShowLoginError(false);
		if (username && password) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [username, password]);

	const inputItemUsername: InputFieldItemTSX = {
		name: 'username',
		class: 'login',
		id: 'username',
		type: 'text',
		labelTranslatable: 'login.user.label',
		content: username,
		icon: <Icon name={ICON_KEYS.PERSON} className={'inputField__icon'} />
	};

	const inputItemPassword: InputFieldItemTSX = {
		name: 'password',
		class: 'passwordFields__fieldGroup__input',
		id: 'passwordInput',
		type: 'password',
		labelTranslatable: 'login.password.label',
		content: password,
		icon: <Icon name={ICON_KEYS.LOCK} className={'inputField__icon'} />
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleLogin = () => {
		if (username && password) {
			autoLogin(username, password, true, () => setShowLoginError(true));
		}
	};

	const handleKeyUp = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	return (
		<div className="loginWrapper">
			<Stage hasAnimation={true}></Stage>
			<div className="loginForm loginForm">
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
					<div className="formWrapper">
						<p className="formWrapper__infoText warning">
							{translate('warningLabels.login.failed')}
						</p>
					</div>
				) : null}
				<a
					href={config.endpoints.loginResetPasswordLink}
					target="_blank"
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
					<p className="loginForm__register__infoText">
						{translate('login.register.infoText.title')}
						<br />
						{translate('login.register.infoText.copy')}
					</p>
					<a
						className="loginForm__register__link"
						href={
							config.endpoints.loginRedirectToRegistrationOverview
						}
						target="_self"
					>
						{translate('login.register.linkLabel')}
					</a>
				</div>
			</div>
		</div>
	);
};
