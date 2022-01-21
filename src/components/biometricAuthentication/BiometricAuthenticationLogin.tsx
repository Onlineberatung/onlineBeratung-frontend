import { useEffect } from 'react';
import {
	checkForBiometricAvailability,
	checkForExistingCredentials,
	checkIdentity
} from '../../utils/biometricAuthenticationHelpers';
import { autoLogin } from '../registration/autoLogin';
import { Credentials } from 'capacitor-native-biometric';

export const BiometricAuthenticationLogin = () => {
	const stageAnimation = () => {
		let stage = document.getElementById('loginLogoWrapper');
		stage?.classList.add('stage--ready');
	};

	useEffect(() => {
		checkForBiometricAvailability(handleAvailableBiometrics, () => {
			stageAnimation();
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleAvailableBiometrics = () => {
		checkForExistingCredentials(handleCredentials, () => {
			stageAnimation();
		});
	};

	const handleCredentials = (hasCredentialsSet: Boolean) => {
		if (hasCredentialsSet) {
			checkIdentity(
				() => {
					stageAnimation();
				},
				() => {
					stageAnimation();
				},
				handleCheckIdentitySuccess
			);
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
	};

	return null;
};
