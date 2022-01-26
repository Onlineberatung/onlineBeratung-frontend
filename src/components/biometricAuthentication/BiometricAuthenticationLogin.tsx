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

	const stageAnimation = () => {
		let stage = document.getElementById('loginLogoWrapper');
		stage?.classList.add('stage--ready');
	};

	useEffect(() => {
		if (isAppActive && !isBiometricDialogOpen.current) {
			isBiometricDialogOpen.current = true;
			checkForBiometricAvailability(
				handleAvailableBiometrics,
				() => {
					stageAnimation();
				},
				() => {
					stageAnimation();
				}
			);
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
		checkForExistingCredentials(handleCredentials, () => {
			stageAnimation();
		});
	};

	const handleCredentials = (hasCredentialsSet: Boolean) => {
		if (hasCredentialsSet) {
			checkIdentity((error) => {
				if (error.code !== '15') {
					stageAnimation();
				} else {
					isBiometricDialogOpen.current = false;
				}
			}, handleCheckIdentitySuccess);
		} else {
			stageAnimation();
		}
	};

	const handleCheckIdentitySuccess = (credentials: Credentials) => {
		autoLogin({
			username: credentials.username,
			password: credentials.password,
			redirect: true
		});
		App.removeAllListeners();
	};

	return null;
};
