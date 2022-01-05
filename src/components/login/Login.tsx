import '../../polyfill';
import * as React from 'react';
import { translate } from '../../utils/translate';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { ComponentType, useState, useEffect } from 'react';
import { apiUrl, config } from '../../resources/scripts/config';
import { ButtonItem, Button, BUTTON_TYPES } from '../button/Button';
import { autoLogin } from '../registration/autoLogin';
import { Text } from '../text/Text';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { StageProps } from '../stage/stage';
import { StageLayout } from '../stageLayout/StageLayout';
import '../../resources/styles/styles';
import './login.styles';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {
	AvailableResult,
	Credentials,
	NativeBiometric
} from 'capacitor-native-biometric';

defineCustomElements(window);

const loginButton: ButtonItem = {
	label: translate('login.button.label'),
	type: BUTTON_TYPES.PRIMARY
};

interface LoginProps {
	stageComponent: ComponentType<StageProps>;
}

export const Login = ({ stageComponent: Stage }: LoginProps) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isButtonDisabled, setIsButtonDisabled] = useState(
		username.length > 0 && password.length > 0
	);
	const [showLoginError, setShowLoginError] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	// const [isBioAuthAvailable, setIsBioAuthAvailable] = useState(false);

	useEffect(() => {
		checkActive();
		checkAvailability();
	}, []);

	useEffect(() => {
		setShowLoginError(false);
		if (username && password) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [username, password]);


	// TODO

	let timer;

	const BioAuthRequest = () => {
		timer = window.setTimeout(checkAvailability, 5000); //3 Minuten = 180000 Millisekunden
	};

	const checkActive = () => {
		document.addEventListener('visibilitychange', function (event) {
			if (document.hidden) {
				BioAuthRequest();
			} else {
				clearTimeout(timer);
			}
		});
	};

	//------------

	const checkAvailability = () => {
		NativeBiometric.isAvailable().then(
			(result: AvailableResult) => {
				const isAvailable = result.isAvailable;
				if (isAvailable) {
					checkIdentity();
					// setIsBioAuthAvailable(true);
				}
			},
			(error) => {
				// TODO : Funktion erstellen
				let stage = document.getElementById('loginLogoWrapper');
				stage.classList.add('stage--ready');
			}
		);		
	};

	const checkIdentity = () => {
		NativeBiometric.getCredentials({
			server: apiUrl
		})
			.then(
				(credentials: Credentials) =>
					new Promise((reject) => {
						NativeBiometric.verifyIdentity({
							reason: 'For easy log in',
							title: 'Log in',
							subtitle: 'Maybe add subtitle here?',
							description: 'Maybe a description too?'
						})
							.then(() => {
								autoLogin({
									username: credentials.username,
									password: credentials.password,
									redirect: true,
									handleLoginError
								});
							})
							
							.catch(reject);
					})
			)
			// .then((credentials: Credentials) => {
			// 	console.log('Test', credentials);
			// 	autoLogin({
			// 		username: credentials.username,
			// 		password: credentials.password,
			// 		redirect: true,
			// 		handleLoginError
			// 	});
			// })
			.catch((err) => {
				console.log('Fehler bei Bio Auth: ' + err.code);
				let stage = document.getElementById('loginLogoWrapper');
				stage.classList.add('stage--ready-mobile');
			});
	};

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

// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// const photoButton: ButtonItem = {
// 	label: 'Take a picture',
// 	type: BUTTON_TYPES.SECONDARY
// };

// <Button
// 	item={photoButton}
// 	buttonHandle={async () => {
// 		await Camera.getPhoto({
// 			quality: 100,
// 			allowEditing: true,
// 			resultType: CameraResultType.Uri,
// 			source: CameraSource.Camera,
// 			saveToGallery: true,
// 			width: 100,
// 			height: 100
// 		}).catch((e) => {
// 			// console.error('E')
// 		});
// 	}}
// />;
