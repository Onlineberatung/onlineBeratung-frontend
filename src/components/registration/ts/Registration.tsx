import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../../stage/ts/stage';
import { InputField, InputFieldItem } from '../../inputField/ts/InputField';
import { SVG } from '../../svgSet/ts/SVG';
import { ICON_KEYS } from '../../svgSet/ts/SVGHelpers';
import { useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { Button } from '../../button/ts/Button';
import * as allRegistrationData from '../registrationData.json';

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

const Registration = () => {
	const [username, setUsername] = useState(null);
	const [postcode, setPostcode] = useState(null);
	const [passwordInput, setPasswordInput] = useState(null);
	const [passwordConfirmation, setPasswordConfirmation] = useState(null);
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
		infoText: translate('registration.user.infoText'),
		labelTranslatable: 'registration.user.label',
		maxLength: 30,
		name: 'username',
		type: 'text'
	};

	const inputItemPostcode: InputFieldItem = {
		content: postcode,
		icon: <SVG name={ICON_KEYS.PIN} />,
		id: 'postcode',
		infoText: translate('registration.postcode.infoText'),
		labelTranslatable: 'registration.postcode.label',
		name: 'postcode',
		type: 'number'
	};

	const inputItemPasswordInput: InputFieldItem = {
		content: passwordInput,
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordInput',
		labelTranslatable: 'registration.password.input.label',
		name: 'passwordInput',
		type: 'text'
	};

	const inputItemPasswordConfirmation: InputFieldItem = {
		content: passwordConfirmation,
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordInput',
		infoText: translate('registration.postcode.infoText'),
		labelTranslatable: 'registration.postcode.label',
		name: 'passwordInput',
		type: 'text'
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePostcodeChange = (event) => {
		setPostcode(event.target.value);
	};

	const handlePasswordInputChange = (event) => {
		setPasswordInput(event.target.value);
	};

	const handlePasswordConfirmationChange = (event) => {
		setPasswordConfirmation(event.target.value);
	};

	return (
		<div className="registration">
			<Stage hasAnimation={true}></Stage>
			<form
				id="registrationForm"
				// IF GENERIC: registration__form--generic
				className="registration__form"
				data-consultingtype="{{consultingType}}"
				data-resources="[{paths: ['components/registrationFormular/ts/registration.js?{{bioTrueEnv 'RELEASE_VERSION'}}']}]"
			>
				<h3>OVERLINE</h3>
				<h1>Registrierung</h1>

				{/* ----------------------------- Required fields ---------------------------- */}
				<div className="generalInformation">
					{/* REMOVE SHOW EMAIL HERE: ONLY EXAMPLE */}
					{registrationData.showEmail ? (
						<InputField
							item={inputItemUsername}
							inputHandle={handleUsernameChange}
						/>
					) : null}
					{/*POST CODE NOT FOR EVERY CONSULTANT TYPE*/}
					<InputField
						item={inputItemPostcode}
						inputHandle={handlePostcodeChange}
					/>
					<InputField
						item={inputItemPasswordInput}
						inputHandle={handlePasswordInputChange}
					/>
					<InputField
						item={inputItemPasswordConfirmation}
						inputHandle={handlePasswordConfirmationChange}
					/>
					{/*
					{{> 'components/inputField/inputField' email.[0]}} */}
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
