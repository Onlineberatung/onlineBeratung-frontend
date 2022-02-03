import {
	AvailableResult,
	Credentials,
	NativeBiometric
} from 'capacitor-native-biometric';
import { apiUrl } from '../resources/scripts/config';

//checks if the currently used device provides the biometric authentication function
export const checkForBiometricAvailability = (
	handleAvailableBiometrics: Function,
	handleUnavailableBiometrics?: Function,
	handleBiometricsError?: Function
) => {
	NativeBiometric.isAvailable()
		.then((result: AvailableResult) => {
			if (result.isAvailable || result.biometryType !== 0) {
				handleAvailableBiometrics();
			} else {
				if (handleUnavailableBiometrics) {
					handleUnavailableBiometrics();
				}
			}
		})
		.catch((err) => {
			if (handleBiometricsError) {
				handleBiometricsError();
			}
		});
};

//checks whether the user has already activated the biometric authentication function in his profile on the currently used device.
//If this is the case, the credentials are saved on the device. (setCredentials)
export const checkForExistingCredentials = (
	handleCredentials: Function,
	handleCredentialsError?: Function
) => {
	NativeBiometric.getCredentials({
		server: apiUrl
	})
		.then((credentials: Credentials) => {
			if (credentials.password && credentials.username) {
				handleCredentials(true);
			} else {
				handleCredentials(false);
			}
		})
		.catch((err) => {
			if (handleCredentialsError) {
				handleCredentialsError();
			}
		});
};

//checks if the user can authenticate with a fingerprint or FaceID stored on the currently used device
export const checkIdentity = (
	handleCheckIdentityCancel: Function,
	handleCheckIdentitySuccess?: Function,
	addBlurEffect?: Function
) => {
	NativeBiometric.getCredentials({
		server: apiUrl
	}).then(
		(credentials: Credentials) =>
			new Promise((reject) => {
				if (addBlurEffect) {
					addBlurEffect();
				}
				NativeBiometric.verifyIdentity({
					reason: 'For easy log in',
					title: 'Log in',
					subtitle: 'Maybe add subtitle here?',
					description: 'Maybe a description too?'
				}).then(
					() => {
						if (handleCheckIdentitySuccess) {
							handleCheckIdentitySuccess(credentials);
						}
					},
					(error) => {
						handleCheckIdentityCancel(error);
					}
				);
			})
	);
};
