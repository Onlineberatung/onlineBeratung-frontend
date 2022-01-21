import { useEffect } from 'react';
import { logout } from '../logout/logout';
import { checkIdentity } from '../../utils/biometricAuthenticationHelpers';
import './biometricAuthentication.styles';

export const BiometricAuthenticationTimer = () => {
	let timer;

	useEffect(() => {
		document.addEventListener('visibilitychange', startAbsenceTimer);
		return () => {
			document.removeEventListener('visibilitychange', startAbsenceTimer);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const startAbsenceTimer = () => {
		if (document.hidden) {
			timer = window.setTimeout(helperFunction, 20000); //3 Minuten = 180 Sekunden = 180000 Millisekunden
		} else {
			clearTimeout(timer);
		}
	};

	const helperFunction = () => {
		checkIdentity(
			() => {
				logout();
			},
			() => {
				logout();
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
