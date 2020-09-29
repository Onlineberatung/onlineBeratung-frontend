import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../../stage/ts/stage';
import { InputField, InputFieldItem } from '../../inputField/ts/InputField';
import { SVG } from '../../svgSet/ts/SVG';
import { ICON_KEYS } from '../../svgSet/ts/SVGHelpers';
import { useEffect, useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { Button } from '../../button/ts/Button';
import * as allRegistrationData from '../registrationData.json';
import { PostcodeSuggestion } from '../../postcodeSuggestion/ts/PostcodeSuggestion';
import {
	inputValuesFit,
	strengthIndicator
} from '../../passwordField/ts/validateInputValue';
import { CheckboxItem, Checkbox } from '../../checkbox/ts/Checkbox';

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

const getPasswordClassNames = (invalid, valid) => {
	if (invalid) {
		return 'inputField__input--invalid';
	}
	if (valid) {
		return 'inputField__input--valid';
	}
};

const Registration = () => {
	const [username, setUsername] = useState(null);
	const [postcode, setPostcode] = useState(null);
	const [agencyId, setAgencyId] = useState(null);
	const [password, setpassword] = useState(null);
	const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(null);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
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
	const [isDataProtectionSelected, setIsDataProtectionSelected] = useState(
		false
	);
	const [consultingType, setConsultingType] = useState(
		getConsultingTypeFromRegistration()
	);
	const registrationDataArray = Object.entries(allRegistrationData).filter(
		(resort) => resort[1].consultingType == consultingType.toString()
	);
	// TODO: u25 vs einsamgemeinsam -> if registrationData.length > 1 -> check key
	const registrationData = registrationDataArray[0][1];

	// check prefill postcode -> AID in URL? (prefillPostcode.ts)
	// prefillPostcode();

	const inputItemUsername: InputFieldItem = {
		content: username,
		icon: <SVG name={ICON_KEYS.PERSON} />,
		id: 'username',
		labelTranslatable: 'registration.user.label',
		infoText: translate('registration.user.infoText'),
		maxLength: 30,
		name: 'username',
		type: 'text'
	};

	const inputItempassword: InputFieldItem = {
		content: password,
		class: getPasswordClassNames(
			!!passwordErrorMessage,
			!!passwordSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordInput',
		labelTranslatable: 'registration.password.input.label',
		infoText:
			(passwordErrorMessage || passwordSuccessMessage
				? `${passwordErrorMessage} ${passwordSuccessMessage}<br>`
				: '') +
			translate('registration.password.confirmation.infoText'),
		name: 'passwordInput',
		type: 'password'
	};

	const inputItemPasswordConfirmation: InputFieldItem = {
		content: passwordConfirmation,
		class: getPasswordClassNames(
			!!passwordConfirmationErrorMessage,
			!!passwordConfirmationSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordConfirmation',
		labelTranslatable: 'registration.password.confirmation.label',
		infoText:
			passwordConfirmationErrorMessage ||
			passwordConfirmationSuccessMessage
				? `${passwordConfirmationErrorMessage} ${passwordConfirmationSuccessMessage}`
				: '',
		name: 'passwordConfirmation',
		type: 'password'
	};

	const inputItemEmail: InputFieldItem = {
		content: email,
		icon: <SVG name={ICON_KEYS.ENVELOPE} />,
		id: 'email',
		labelTranslatable: 'registration.email.label',
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

	const handleUsernameChange = (event) => {
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
		setEmail(event.target.value);
	};

	const validatePassword = (password) => {
		let passwordStrength = strengthIndicator(password);
		console.log('password strength', passwordStrength);
		if (password.length >= 1 && passwordStrength < 4) {
			setPasswordSuccessMessage('');
			setPasswordErrorMessage(
				translate('registration.password.insecure')
			);
		} else if (password.length >= 1) {
			setPasswordSuccessMessage(
				translate('registration.password.secure')
			);
			setPasswordErrorMessage('');
		} else {
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

	return (
		<div className="registration">
			<Stage hasAnimation={true}></Stage>
			<form
				id="registrationForm"
				// IF GENERIC: registration__form--generic ???
				className="registration__form"
				data-consultingtype="{{consultingType}}"
				data-resources="[{paths: ['components/registrationFormular/ts/registration.js?{{bioTrueEnv 'RELEASE_VERSION'}}']}]"
			>
				<h3>{registrationData.overline}</h3>
				<h1>Registrierung</h1>

				{/* ----------------------------- Required Fields ---------------------------- */}
				<div className="generalInformation">
					<InputField
						item={inputItemUsername}
						inputHandle={handleUsernameChange}
					/>
					{registrationData.showPostCode ? (
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
					<InputField
						item={inputItemEmail}
						inputHandle={handleEmailChange}
					/>
				</div>

				{/* ----------------------------- Submit Section ---------------------------- */}
				<div className="registrationFooter">
					<div className="registrationFooter__requiredInfo">
						<p className="formWrapper__infoText">
							{translate('registration.required.infoText')}
						</p>
					</div>
					<Checkbox
						item={checkboxItemDataProtection}
						checkboxHandle={() =>
							setIsDataProtectionSelected(
								!isDataProtectionSelected
							)
						}
					/>
					{/* {{> 'components/checkbox/checkbox' termsCheckbox.[0]}}
					{{> 'components/button/button' sendButton.[0]}} */}
				</div>
			</form>

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
