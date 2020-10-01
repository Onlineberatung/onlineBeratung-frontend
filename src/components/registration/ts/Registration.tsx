import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../../stage/ts/stage';
import { InputField, InputFieldItem } from '../../inputField/ts/InputField';
import { SVG } from '../../svgSet/ts/SVG';
import { ICON_KEYS } from '../../svgSet/ts/SVGHelpers';
import { useEffect, useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { Button, ButtonItem, BUTTON_TYPES } from '../../button/ts/Button';
import * as registrationResortsData from '../registrationData.json';
import { PostcodeSuggestion } from '../../postcodeSuggestion/ts/PostcodeSuggestion';
import {
	inputValuesFit,
	strengthIndicator
} from '../../passwordField/ts/validateInputValue';
import { CheckboxItem, Checkbox } from '../../checkbox/ts/Checkbox';
import { isStringValidEmail, MIN_USERNAME_LENGTH } from './registrationHelper';
import { postRegistration } from '../../apiWrapper/ts/ajaxCallRegistration';
import { config } from '../../../resources/ts/config';
import { setTokenInCookie } from '../../sessionCookie/ts/accessSessionCookie';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

const getConsultingTypeFromRegistration = () =>
	parseInt(
		document.getElementById('registrationRoot').dataset.consultingtype
	);

const getValidationClassNames = (invalid, valid) => {
	if (invalid) {
		return 'inputField__input--invalid';
	}
	if (valid) {
		return 'inputField__input--valid';
	}
	return '';
};

const Registration = () => {
	const [username, setUsername] = useState(null);
	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [usernameSuccessMessage, setUsernameSuccessMessage] = useState(null);
	const [usernameErrorMessage, setUsernameErrorMessage] = useState(null);
	const [postcode, setPostcode] = useState(null);
	const [agencyId, setAgencyId] = useState(null);
	const [password, setpassword] = useState(null);
	const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(null);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [passwordConfirmation, setPasswordConfirmation] = useState(null);
	const [
		passwordConfirmationSuccessMessage,
		setPasswordConfirmationSuccessMessage
	] = useState(null);
	const [
		passwordConfirmationErrorMessage,
		setPasswordConfirmationErrorMessage
	] = useState(null);
	const [email, setEmail] = useState(null);
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [emailSuccessMessage, setEmailSuccessMessage] = useState(null);
	const [emailErrorMessage, setEmailErrorMessage] = useState(null);
	const [isDataProtectionSelected, setIsDataProtectionSelected] = useState(
		false
	);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [consultingType] = useState(getConsultingTypeFromRegistration());

	const resortDataArray = Object.entries(registrationResortsData).filter(
		(resort) => resort[1].consultingType == consultingType.toString()
	);

	let resortData;
	if (resortDataArray.length > 1) {
		const resortName = document.getElementById('registrationRoot').dataset
			.resortname;
		resortData = resortDataArray.filter(
			(resort) => resort[0] === resortName
		)[0][1];
	} else {
		resortData = resortDataArray[0][1];
	}

	// SET FORMAL/INFORMAL COOKIE
	setTokenInCookie('useInformal', resortData.useInformal ? '1' : '');

	// check prefill postcode -> AID in URL? (prefillPostcode.ts)
	// prefillPostcode();

	const isRegistrationValid = () => {
		const generalValidation =
			isUsernameValid &&
			password &&
			isPasswordValid &&
			password === passwordConfirmation &&
			isDataProtectionSelected;

		if (resortData.showPostCode && resortData.showEmail) {
			return generalValidation && postcode && agencyId && isEmailValid;
		} else if (resortData.showPostCode) {
			return generalValidation && postcode && agencyId;
		} else if (resortData.showEmail) {
			return generalValidation && isEmailValid;
		} else {
			return generalValidation;
		}
	};

	useEffect(() => {
		if (isRegistrationValid()) {
			setIsSubmitButtonDisabled(false);
		} else {
			setIsSubmitButtonDisabled(true);
		}
	}, [
		username,
		postcode,
		password,
		passwordConfirmation,
		email,
		isDataProtectionSelected
	]);

	const inputItemUsername: InputFieldItem = {
		content: username,
		class: getValidationClassNames(
			!!usernameErrorMessage,
			!!usernameSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.PERSON} />,
		id: 'username',
		label:
			usernameErrorMessage || usernameSuccessMessage
				? `${usernameErrorMessage} ${usernameSuccessMessage}`
				: translate('registration.user.label'),
		infoText: translate('registration.user.infoText'),
		maxLength: 30,
		name: 'username',
		type: 'text'
	};

	const inputItempassword: InputFieldItem = {
		content: password,
		class: getValidationClassNames(
			!!passwordErrorMessage,
			!!passwordSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordInput',
		label:
			passwordErrorMessage || passwordSuccessMessage
				? `${passwordErrorMessage} ${passwordSuccessMessage}`
				: translate('registration.password.input.label'),
		name: 'passwordInput',
		type: 'password'
	};

	const inputItemPasswordConfirmation: InputFieldItem = {
		content: passwordConfirmation,
		class: getValidationClassNames(
			!!passwordConfirmationErrorMessage,
			!!passwordConfirmationSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordConfirmation',
		label:
			passwordConfirmationErrorMessage ||
			passwordConfirmationSuccessMessage
				? `${passwordConfirmationErrorMessage} ${passwordConfirmationSuccessMessage}`
				: translate('registration.password.confirmation.label'),
		infoText: translate('registration.password.confirmation.infoText'),
		name: 'passwordConfirmation',
		type: 'password'
	};

	const inputItemEmail: InputFieldItem = {
		content: email,
		class: getValidationClassNames(
			!!emailErrorMessage,
			!!emailSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.ENVELOPE} />,
		id: 'email',
		label:
			emailErrorMessage || emailSuccessMessage
				? `${emailErrorMessage} ${emailSuccessMessage}`
				: translate('registration.email.label'),
		infoText: translate('registration.email.infoText'),
		name: 'email',
		type: 'text'
	};

	const checkboxItemDataProtection: CheckboxItem = {
		inputId: 'dataProtectionCheckbox',
		name: 'dataProtectionCheckbox',
		labelId: 'dataProtectionLabel',
		label: translate('registration.dataProtection.label'),
		checked: isDataProtectionSelected
	};

	const buttonItemSubmit: ButtonItem = {
		label: translate('registration.submitButton.label'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleUsernameChange = (event) => {
		validateUsername(event.target.value);
		setUsername(event.target.value);
	};

	const handlepasswordChange = (event) => {
		validatePassword(event.target.value);
		setpassword(event.target.value);
	};

	const handlePasswordConfirmationChange = (event) => {
		validatePasswordConfirmation(event.target.value);
		setPasswordConfirmation(event.target.value);
	};

	const handleEmailChange = (event) => {
		validateEmail(event.target.value);
		setEmail(event.target.value);
	};

	const handleSubmitButtonClick = () => {
		const registrationData = {
			username: username,
			password: encodeURIComponent(password),
			consultingType: consultingType,
			termsAccepted: isDataProtectionSelected.toString(),
			...(email && { email: email }),
			...(resortData.showPostCode && { postcode: postcode }),
			...(resortData.showPostCode && { agencyId: agencyId })
		};

		postRegistration(config.endpoints.registerAsker, registrationData);
	};

	const validateUsername = (username) => {
		if (username.length >= MIN_USERNAME_LENGTH) {
			setIsUsernameValid(true);
			setUsernameSuccessMessage(translate('registration.user.suitable'));
			setUsernameErrorMessage('');
		} else if (username.length > 0) {
			setIsUsernameValid(false);
			setUsernameSuccessMessage('');
			setUsernameErrorMessage(translate('registration.user.unsuitable'));
		} else {
			setIsUsernameValid(false);
			setUsernameSuccessMessage('');
			setUsernameErrorMessage('');
		}
	};

	const validatePassword = (password) => {
		let passwordStrength = strengthIndicator(password);
		if (password.length >= 1 && passwordStrength < 4) {
			setIsPasswordValid(false);
			setPasswordSuccessMessage('');
			setPasswordErrorMessage(
				translate('registration.password.insecure')
			);
		} else if (password.length >= 1) {
			setIsPasswordValid(true);
			setPasswordSuccessMessage(
				translate('registration.password.secure')
			);
			setPasswordErrorMessage('');
		} else {
			setIsPasswordValid(false);
			setPasswordSuccessMessage('');
			setPasswordErrorMessage('');
		}
	};

	const validatePasswordConfirmation = (confirmPassword) => {
		let passwordFits = inputValuesFit(confirmPassword, password);
		if (confirmPassword.length >= 1 && !passwordFits) {
			setPasswordConfirmationSuccessMessage('');
			setPasswordConfirmationErrorMessage(
				translate('registration.password.notSame')
			);
		} else if (confirmPassword.length >= 1) {
			setPasswordConfirmationSuccessMessage(
				translate('registration.password.same')
			);
			setPasswordConfirmationErrorMessage('');
		} else {
			setPasswordConfirmationSuccessMessage('');
			setPasswordConfirmationErrorMessage('');
		}
	};

	const validateEmail = (email) => {
		if (email.length > 0 && isStringValidEmail(email)) {
			setIsEmailValid(true);
			setEmailSuccessMessage(translate('registration.email.valid'));
			setEmailErrorMessage('');
		} else if (email.length > 0) {
			setIsEmailValid(false);
			setEmailSuccessMessage('');
			setEmailErrorMessage(translate('registration.email.invalid'));
		} else {
			setIsEmailValid(true);
			setEmailSuccessMessage('');
			setEmailErrorMessage('');
		}
	};

	return (
		<div className="registration">
			<Stage hasAnimation={true}></Stage>
			<form
				id="registrationForm"
				className="registration__form"
				data-consultingtype="{{consultingType}}"
				data-resources="[{paths: ['components/registrationFormular/ts/registration.js?{{bioTrueEnv 'RELEASE_VERSION'}}']}]"
			>
				<h3 className="registration__overline">
					{resortData.overline}
				</h3>
				<h1 className="registration__headline">Registrierung</h1>

				{/* ----------------------------- Required Fields ---------------------------- */}
				<div className="registration__generalInformation">
					<InputField
						item={inputItemUsername}
						inputHandle={handleUsernameChange}
					/>
					{resortData.showPostCode ? (
						<PostcodeSuggestion
							selectedConsultingType={consultingType}
							icon={<SVG name={ICON_KEYS.PIN} />}
							setAgency={(agency) => {
								if (agency) {
									setAgencyId(agency?.id);
									setPostcode(agency?.typedPostcode);
								}
							}}
						/>
					) : null}
					<InputField
						item={inputItempassword}
						inputHandle={handlepasswordChange}
					/>
					<InputField
						item={inputItemPasswordConfirmation}
						inputHandle={handlePasswordConfirmationChange}
					/>
					{resortData.showEmail ? (
						<InputField
							item={inputItemEmail}
							inputHandle={handleEmailChange}
						/>
					) : null}
				</div>

				{/* ----------------------------- Submit Section ---------------------------- */}
				<div className="registration__footer">
					<p className="registration__requiredInfoText formWrapper__infoText">
						{translate('registration.required.infoText')}
					</p>

					<Checkbox
						item={checkboxItemDataProtection}
						checkboxHandle={() =>
							setIsDataProtectionSelected(
								!isDataProtectionSelected
							)
						}
					/>
					<Button
						item={buttonItemSubmit}
						buttonHandle={handleSubmitButtonClick}
						disabled={isSubmitButtonDisabled}
					/>
				</div>
			</form>

			{/* ----------------------------- TO LOGIN BUTTON ---------------------------- */}
			<div className="registration__toLogin">
				<p className="registration__toLogin__text">
					{translate('registration.login.helper')}
				</p>
				<div className="registration__toLogin__button">
					<a href="/login.html">
						<Button
							item={{
								label: translate('registration.login.label'),
								type: 'TERTIARY',
								id: 'editGroupChat'
							}}
							isLink={true}
							buttonHandle={() => {}}
						/>
					</a>
				</div>
			</div>
		</div>
	);
};
