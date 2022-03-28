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

	// If the user closes the app in the login area during the authentication process, this is perceived as an error in the checkIdentity method.
	// If thats the case, the implementation in the Effect Hook allows the user to authenticate again with their biometrics when reopening the app - although the verifyIdentity method failed previously
	useEffect(() => {
		if (isAppActive && !isBiometricDialogOpen.current) {
			isBiometricDialogOpen.current = true;
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
		checkForExistingCredentials(handleCredentials);
	};

	const handleCredentials = (hasCredentialsSet: Boolean) => {
		if (hasCredentialsSet) {
			// If the stage hasn't already been animated, the authenticationProcess function will be executed after 3.5 sec - it will wait until the stage was animated
			if (isBiometricDialogOpen.current === true && !isAnimated) {
				setTimeout(authenticationProcess, 3500);
			} else {
				// If the stage has already been animated, the authenticationProcess function will be executed immediately after the app has been opened
				authenticationProcess();
			}
		}
		let stageStatus = document.querySelector('.stage--ready');
		stageStatus.addEventListener('animationend', () => {
			setIsAnimated(true);
		});
	};

	const authenticationProcess = () => {
		//ios
		//error.code 15: Closing the app during the authentication process

		//android
		//error.code 0: Active cancellation of the authentication process by the user
		//error.code 0: Closing the app during the authentication process
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
