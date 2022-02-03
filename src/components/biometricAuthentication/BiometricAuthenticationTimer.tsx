import { useEffect, useState } from 'react';
import { logout } from '../logout/logout';
import { checkIdentity } from '../../utils/biometricAuthenticationHelpers';
import './biometricAuthentication.styles';
import { App } from '@capacitor/app';
import React from 'react';
import { isAndroid, isIOS } from 'react-device-detect';

export const BiometricAuthenticationTimer = () => {
	let timerStart: number;
	let timerStop: number;
	let timerLimit = 5; //Specified in seconds
	const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
	const [isAppActive, setIsAppActive] = useState<boolean>(true);

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
		//ios
		//error.code 16: Active cancellation of the authentication process by the user
		//error.code 15: Closing the app during the authentication process

		//android
		//error.code 0: Active cancellation of the authentication process by the user
		//error.code 0: Closing the app during the authentication process

		// android: no case differentiation based on the error codes is possible.
		// In both cases the error code 0 is returned. Therefore the error message is checked

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
				error.message === 'Verification error: Unbekannter Fehler 5'
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
			<div className="bounceEffect">
				<div className="effect1"></div>
				<div className="effect2"></div>
			</div>
		);
	}

	return null;
};
