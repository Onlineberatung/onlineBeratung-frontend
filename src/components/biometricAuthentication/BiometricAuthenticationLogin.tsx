import { useEffect, useRef, useState } from 'react';
import {
	checkForBiometricAvailability,
	checkForExistingCredentials,
	checkIdentity
} from '../../utils/biometricAuthenticationHelpers';
import { autoLogin } from '../registration/autoLogin';
import { Credentials } from 'capacitor-native-biometric';
import { App } from '@capacitor/app';

export const BiometricAuthenticationLogin = () => {
	const [isAppActive, setIsAppActive] = useState<boolean>(true);
	const isBiometricDialogOpen = useRef<boolean>(false);
	const [isAnimated, setIsAnimated] = useState<boolean>(false);

	useEffect(() => {
		if (isAppActive && !isBiometricDialogOpen.current) {
			isBiometricDialogOpen.current = true;
			console.log('Login: checkForBiometricAvailability');
			checkForBiometricAvailability(handleAvailableBiometrics);
		} else if (isAppActive && isBiometricDialogOpen.current) {
			isBiometricDialogOpen.current = false;
		}
	}, [isAppActive]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		App.addListener('appStateChange', ({ isActive }) => {
			setIsAppActive(isActive);
		});
		return () => {
			App.removeAllListeners();
		};
	}, []);

	const handleAvailableBiometrics = () => {
		console.log('Login: checkForExistingCredentials');
		checkForExistingCredentials(handleCredentials);
	};

	const handleCredentials = (hasCredentialsSet: Boolean) => {
		if (hasCredentialsSet) {
			//if the stage hasn't already been animated, the authenticationProcess Function will be executed after 3.5 sec - wait until the stage was animated
			if (isBiometricDialogOpen.current === true && !isAnimated) {
				setTimeout(authenticationProcess, 3500);
			} else {
				//if the stage has already been animated, the authenticationProcess Function will be executed immediately after opening the app
				authenticationProcess();
			}
		}
		let stageStatus = document.querySelector('.stage--ready');
		stageStatus.addEventListener('animationend', () => {
			console.log('Animation ended');
			setIsAnimated(true);
		});
	};

	const authenticationProcess = () => {
		checkIdentity((error) => {
			if (error.code === '15' || error.code === '0') {
				isBiometricDialogOpen.current = false;
			}
		}, handleCheckIdentitySuccess);
	};

	const handleCheckIdentitySuccess = (credentials: Credentials) => {
		autoLogin({
			username: credentials.username,
			password: credentials.password,
			redirect: true
		});

		document
			.querySelector('#username')
			.setAttribute('value', credentials.username);
		document
			.querySelector('#passwordInput')
			.setAttribute('value', credentials.password);

		App.removeAllListeners();
	};

	return null;
};
