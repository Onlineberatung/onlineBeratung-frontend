import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../globalState';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import Switch from 'react-switch';
import './biometricAuthentication.styles';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { getKeycloakAccessToken } from '../sessionCookie/getKeycloakAccessToken';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { ReactComponent as CheckIllustration } from '../../resources/img/illustrations/check.svg';
import { BUTTON_TYPES } from '../button/Button';
import { NativeBiometric } from 'capacitor-native-biometric';
import { apiUrl } from '../../resources/scripts/config';
import {
	checkForBiometricAvailability,
	checkForExistingCredentials
} from '../../utils/biometricAuthenticationHelpers';
import '../profile/twoFactorAuth.styles';

export const BiometricAuthenticationProfile = (props: {
	activateBiometricAuthTimer: Function;
}) => {
	const [isPasswordValid, setIsPasswordValid] = useState(null);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [password, setPassword] = useState('');
	const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(false);
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const [isSuccessOverlay, setIsSuccessOverlay] = useState<boolean>(false);
	const { userData } = useContext(UserDataContext);
	const [isNativeBiometricAvailable, setIsNativeBiometricAvailable] =
		useState(false);

	useEffect(() => {
		checkForBiometricAvailability(handleAvailableBiometrics);
	}, []);

	const handleAvailableBiometrics = () => {
		setIsNativeBiometricAvailable(true);
		checkForExistingCredentials((hasCredentialsSet) =>
			setIsSwitchChecked(hasCredentialsSet)
		);
	};

	// Set credentials on currently used device
	const functionSetCredentials = () => {
		NativeBiometric.setCredentials({
			username: userData.userName,
			password: password,
			server: apiUrl
		}).then(props.activateBiometricAuthTimer(true));
	};

	// Delete credentials on currently used device
	const functionDeleteCredentials = () => {
		NativeBiometric.deleteCredentials({
			server: apiUrl
		}).then(props.activateBiometricAuthTimer(false));
	};

	const handleSwitchChange = () => {
		if (!isSwitchChecked) {
			setIsOverlayActive(true);
			setIsSuccessOverlay(false);
		} else {
			setIsSwitchChecked(false);
			functionDeleteCredentials();
		}
	};

	const getClassNames = (valid) => {
		let classNames = [];
		if (valid === false) {
			classNames.push('biometricAuth__password--error');
		}
		return classNames.join(' ');
	};

	const handlePasswordInput = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = () => {
		let username = userData.userName;
		getKeycloakAccessToken(username, password)
			.then((response) => {
				setIsPasswordValid(true);
				setIsSwitchChecked(true);
				setIsSuccessOverlay(true);
				setPasswordErrorMessage('');
				setPassword('');
				setIsPasswordValid(undefined);
				functionSetCredentials();
			})
			.catch((error) => {
				setIsPasswordValid(false);
				setIsSwitchChecked(false);
				setPasswordErrorMessage('Ihr Passwort ist nicht korrekt'); // TO DO: Wording
			});
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setIsOverlayActive(false);
			setPasswordErrorMessage('');
			setPassword('');
			setIsPasswordValid(undefined);
		} else {
			handleSubmit();
		}
	};

	const bioAuthPasswordItem: InputFieldItem = {
		id: 'bioAuthPassword',
		type: 'password',
		name: 'bioAuthPassword',
		label: 'Passwort zur Bestätigung', // TO DO: Wording
		class: getClassNames(isPasswordValid),
		infoText: passwordErrorMessage,
		content: password
	};

	const overlaySuccess: OverlayItem = {
		headline: 'Biometric Authentication wurde aktiviert', // TO DO: Wording
		svg: CheckIllustration,
		buttonSet: [
			{
				label: 'Fertig', // TO DO: Wording
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const overlayConfirm: OverlayItem = {
		headline: 'Bestätigung', // TO DO: Wording
		headlineStyleLevel: '1',
		copy: 'Um Biometric Authentication aktivieren zu können, müssen Sie sich hier einmalig mit ihrem Kennwort authentifizieren', // TO DO: Wording
		nestedComponent: (
			<InputField
				item={bioAuthPasswordItem}
				inputHandle={handlePasswordInput}
			/>
		),
		buttonSet: [
			{
				label: 'Biometric Authentication aktivieren', // TO DO: Wording
				type: BUTTON_TYPES.PRIMARY,
				disabled: password.length === 0
			},
			{
				label: 'Zurück', // TO DO: Wording
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			}
		]
	};

	if (!isNativeBiometricAvailable) {
		return null;
	}

	return (
		<div className="bioAuth">
			<div className="profile__content__title">
				<Headline text={'Biometric Authentication'} semanticLevel="5" />
				<Text
					text={
						'Mit Hilfe dieser Funktion können Sie sich mit FingerID oder FaceID bei Ihrer Caritas App anmelden.' // TO DO: Wording
					}
					type="infoLargeAlternative"
				/>
			</div>
			<label className="twoFactorAuth__switch">
				<Switch
					onChange={handleSwitchChange}
					checked={isSwitchChecked}
					uncheckedIcon={false}
					checkedIcon={false}
					width={48}
					height={26}
					onColor="#0dcd21"
					offColor="#8C878C"
					boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
					handleDiameter={27}
					activeBoxShadow="none"
				/>
				<Text
					text={
						isSwitchChecked
							? 'Biometric Authentication aktiviert' // TO DO: Wording
							: 'Biometric Authentication deaktiviert' // TO DO: Wording
					}
					type="standard"
				/>
			</label>
			{isOverlayActive && (
				<OverlayWrapper>
					<Overlay
						className="activateBioAuth__overlay"
						item={
							isSuccessOverlay ? overlaySuccess : overlayConfirm
						}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</div>
	);
};
