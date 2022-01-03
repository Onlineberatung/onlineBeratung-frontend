import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { CheckboxItem, Checkbox } from '../checkbox/Checkbox';
import { InputFieldItem, InputField } from '../inputField/InputField';

import './biometricAuthenticationSettings.styles';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { UserDataContext } from '../../globalState';
import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { BUTTON_TYPES } from '../button/Button';
import { AvailableResult, NativeBiometric } from 'capacitor-native-biometric';

export const BiometricAuthenticationSettings = () => {
	const [isNativeBiometricAvailable, setIsNativeBiometricAvailable] =
		useState(false);
	const { userData } = useContext(UserDataContext);
	const [password, setPassword] = useState('');
	const [isChecked, setIsChecked] = useState(false);
	const [isEntered, setIsEntered] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(null);
	const [overlayActive, setOverlayActive] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [isBioAuthActive, setIsBioAuthActive] = useState(false);
	const [checkboxLabel, setCheckboxLabel] = useState(
		'Biometric Authentication aktivieren'
	);
	const [overlayHeadline, setOverlayHeadline] = useState(
		'Biometric Authentication wurde aktiviert'
	);

	useEffect(() => {
		checkAvailability();
	}, []);

	const checkAvailability = () => {
		NativeBiometric.isAvailable().then(
			(result: AvailableResult) => {
				const isAvailable = result.isAvailable;
				if (isAvailable) {
					setIsNativeBiometricAvailable(true);
				}
			},
			(error) => {
				console.log('1) not available');
			}
		);
		console.log('2) not available');
	};

	const bioAuthCheckboxItem: CheckboxItem = {
		inputId: 'bioAuthCheckBox',
		name: 'bioAuthCheckBox',
		labelId: 'bioAuthCheckBox',
		label: checkboxLabel,
		checked: isChecked
	};

	const handleCheckboxClick = () => {
		setIsChecked(!isChecked);
		checkRequirements();
	};

	const getClassNames = (valid) => {
		let classNames = ['passwordReset__input'];
		if (valid === false) {
			classNames.push('passwordReset__input--red');
		}
		return classNames.join(' ');
	};

	const bioAuthPasswordItem: InputFieldItem = {
		id: 'bioAuthPassword',
		type: 'password',
		name: 'bioAuthPassword',
		label: 'Passwort zur Bestätigung',
		class: getClassNames(isPasswordValid),
		infoText: passwordErrorMessage,
		content: password
	};

	const handlePasswordEnter = (event) => {
		setPassword(event.target.value);
		if (event.target.value.length > 0) {
			setIsEntered(true);
		} else {
			setIsEntered(false);
		}
		checkRequirements();
	};

	const checkRequirements = () => {
		if (isEntered && isChecked) {
			setIsComplete(true);
		} else {
			setIsComplete(false);
		}
	};

	const bioAuthActiveOverlay: OverlayItem = {
		svg: CheckIcon,
		headline: overlayHeadline,
		buttonSet: [
			{
				label: 'Fertig',
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const handleOverlayAction = (buttonFunction: string) => {
		setOverlayActive(false);
	};

	const handleSubmit = () => {
		let username = userData.userName;
		if (isComplete) {
			getKeycloakAccessToken(username, password)
				.then((response) => {
					setIsPasswordValid(true);
					setPasswordErrorMessage('');
					setIsChecked(false);
					setIsEntered(false);
					setIsComplete(false);
					setPassword('');
					setIsBioAuthActive(!isBioAuthActive);

					if (isBioAuthActive === true) {
						setCheckboxLabel(
							'Biometric Authentication deaktivieren'
						);
						setOverlayHeadline(
							'Biometric Authentication wurde aktiviert'
						);
						setCredentials();
					} else if (isBioAuthActive === false) {
						setCheckboxLabel('Biometric Authentication aktivieren');
						setOverlayHeadline(
							'Biometric Authentication wurde deaktiviert'
						);
						deleteCredentials();
					}
					setOverlayActive(true);
				})
				.catch((error) => {
					setIsPasswordValid(false);
					setPasswordErrorMessage('Ihr Passwort ist falsch');
				});
		}
	};

	const setCredentials = () => {
		console.log('setCredentials wird aufgerufen');
		console.log(
			'username: ' + userData.userName + ' passwort: ' + password
		);
		NativeBiometric.setCredentials({
			username: userData.userName,
			password: password,
			server: 'string' //Any string to identify the credentials object with
		}).then();
	};

	const deleteCredentials = () => {
		console.log('deleteCredentials wird aufgerufen');

		NativeBiometric.deleteCredentials({
			server: 'string' //The string used to identify the credentials object when setting the credentials.
		}).then();
	};

	if (isNativeBiometricAvailable === false) {
		return (
			<div className="bioAuth__container">
				<Headline
					text="Biometric Authentication nicht verfügbar"
					semanticLevel="5"
				/>
			</div>
		);
	}

	return (
		<div className="bioAuth__container">
			<Headline text="Biometric Authentication" semanticLevel="5" />
			<Text
				text="Durch diese Funktion können Sie sich mit FingerID oder FaceID bei Ihrer Caritas App anmelden."
				type="infoLargeAlternative"
			/>
			<div className="BioAuthCeckbox__conntainer">
				<Checkbox
					item={bioAuthCheckboxItem}
					checkboxHandle={handleCheckboxClick}
				/>
			</div>
			<div>
				<InputField
					item={bioAuthPasswordItem}
					inputHandle={handlePasswordEnter}
				/>
			</div>
			<div className="button__wrapper">
				<span
					onClick={handleSubmit}
					id="passwordResetButton"
					role="button"
					className={
						'bioAuth__button' +
						(!isComplete ? ' bioAuth__button--disabled' : '')
					}
				>
					{checkboxLabel}
				</span>
			</div>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={bioAuthActiveOverlay}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
