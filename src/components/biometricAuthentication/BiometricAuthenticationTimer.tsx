import { useEffect } from 'react';
import { logout } from '../logout/logout';
import { checkIdentity } from '../../utils/biometricAuthenticationHelpers';
import './biometricAuthentication.styles';

export const BiometricAuthenticationTimer = () => {
	let timerStart: number;
	let timerStop: number;

	useEffect(() => {
		document.addEventListener('visibilitychange', startAbsenceTimer);
		return () => {
			document.removeEventListener('visibilitychange', startAbsenceTimer);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const startAbsenceTimer = () => {
		if (document.hidden) {
			timerStart = Date.now();
		} else {
			timerStop = Date.now();
		}
		console.log('Dauer: ' + (timerStop - timerStart) / 1000 + ' Sekunden');

		if ((timerStop - timerStart) / 1000 > 5) {
			console.log('App war länger als 5 sek im Hintergrund');
			helperFunction();
		}
	};

	const helperFunction = () => {
		console.log('helperFunction wird aufgerufen');
		checkIdentity(
			(error) => {
				//error.code 16 =
				if (error.code === '16' || error.code === '0') {
					logout();
					console.log('error.code ist 16 --> Logout');
				} else {
					console.log('error.code ist 15');
					// document.addEventListener('visibilitychange', testfunc);
					// checkIdentity --> TODO
				}
			},
			() => {
				document
					.querySelector('.app')
					?.classList.remove('blur__background--disabled');
			},
			() => {
				document
					.querySelector('.app')
					?.classList.add('blur__background--disabled');
			}
		);
	};

	return null;
};
