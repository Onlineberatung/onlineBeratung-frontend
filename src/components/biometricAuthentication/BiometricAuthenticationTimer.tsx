import { useEffect, useState } from 'react';
import { logout } from '../logout/logout';
import { checkIdentity } from '../../utils/biometricAuthenticationHelpers';
import './biometricAuthentication.styles';
import { App } from '@capacitor/app';
import React from 'react';
import { isAndroid, isIOS } from 'react-device-detect';
import { LoadingIndicator } from '../loadingIndicator/LoadingIndicator';

export const BiometricAuthenticationTimer = () => {
	let timerStart: number;
	let timerStop: number;
	let timerLimit = 5; // Specified in seconds
	const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
	const [isAppActive, setIsAppActive] = useState<boolean>(true);

	// ios and Android react differently in terms of executing functions when the app is closed.
	// Therefore, the timer is implemented differently at some points for Android and ios.

	useEffect(() => {
		document.addEventListener('visibilitychange', startAbsenceTimer);
		return () => {
			document.removeEventListener('visibilitychange', startAbsenceTimer);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (isAndroid) {
			App.addListener('appStateChange', ({ isActive }) => {
				setIsAppActive(isActive);
			});
		}
	}, [isAppActive]); // eslint-disable-line react-hooks/exhaustive-deps

	const startAbsenceTimer = () => {
		if (document.hidden) {
			timerStart = Date.now();
		} else {
			timerStop = Date.now();
		}

		if ((timerStop - timerStart) / 1000 > timerLimit) {
			authProcess();
			App.removeAllListeners();
		}
	};

	const authProcessWhenRecallAppIos = (isAppInForegorund) => {
		if (isAppInForegorund) {
			authProcess();
			App.removeAllListeners();
		}
	};

	const authProcessWhenRecallAppAndroid = () => {
		if (isAppActive) {
			authProcess();
		}
	};

	const errorHandling = (error) => {
		// This Method determines how the user cancels the authentication process

		// ios
		// error.code 16: Active cancellation of the authentication process by the user
		// error.code 15: Closing the app during the authentication process

		// android
		// error.code 0: Active cancellation of the authentication process by the user
		// error.code 0: Closing the app during the authentication process

		// If the user cancels the authentication process actively - the cancel button is pressed - the logout will take place.
		// If the user cancels the authentication process passively - so the app is closed during the authentication process - there is still the possibility to authenticate with biometrics.

		// android: no case differentiation based on the error codes is possible.
		// In both cases the error code 0 is returned. Therefore the error message is checked
		// Checking the error message is error prone - it depends on the language which is set on the device.
		// Currently english and german is considered - If another language is set on the device and the user cancels the authentication process passively, the logout will take place instead.

		if (isIOS) {
			if (error.code === '15') {
				App.removeAllListeners();
				App.addListener('appStateChange', ({ isActive }) => {
					authProcessWhenRecallAppIos(isActive);
				});
			} else {
				logout();
				setIsLogoutLoading(true);
			}
		} else if (isAndroid) {
			if (
				error.code === '0' &&
				(error.message === 'Verification error: Unbekannter Fehler 5' ||
					error.message === 'Verification error: Unknown error 5')
			) {
				authProcessWhenRecallAppAndroid();
			} else {
				logout();
				setIsLogoutLoading(true);
			}
		} else {
			logout();
			setIsLogoutLoading(true);
		}
	};

	const authProcess = () => {
		if (!document.hidden) {
			checkIdentity(
				(error) => {
					errorHandling(error);
				},
				() => {
					App.removeAllListeners();
					document
						.querySelector('.app__wrapper')
						?.classList.remove('blur__background--disabled');
				},
				() => {
					document
						.querySelector('.app__wrapper')
						?.classList.add('blur__background--disabled');
				}
			);
		}
	};

	if (isLogoutLoading) {
		return (
			<div className="loadingIndicator__position">
				<LoadingIndicator />
			</div>
		);
	}

	return null;
};
