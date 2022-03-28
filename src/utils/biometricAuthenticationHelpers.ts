import {
	AvailableResult,
	Credentials,
	NativeBiometric
} from 'capacitor-native-biometric';
import { apiUrl } from '../resources/scripts/config';

// Checks if the currently used device provides the biometric authentication function
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

// Checks whether the user has already activated the biometric authentication function in his profile on the currently used device.
// If this is the case, the credentials have already been saved on the device. (setCredentials)
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

// Prompts the user to authenticate using fingerprint or FaceID and checks if the authentication is successful.
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
					reason: 'For easy log in', // TODO: Wording
					title: 'Log in', // TODO: Wording
					subtitle: 'Maybe add subtitle here?', // TODO: Wording
					description: 'Maybe a description too?' // TODO: Wording
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
