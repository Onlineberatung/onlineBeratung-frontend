import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { LABEL_TYPES, Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	inputValuesFit,
	passwordCriteria,
	validatePasswordCriteria
} from '../../resources/scripts/helpers/validateInputValue';
import { AccordionItemValidity } from './registrationHelpers';
import './registrationPassword.styles';

interface RegistrationPasswordProps {
	hasNoResetNote: boolean;
	onPasswordChange: Function;
	onValidityChange: Function;
}

export const RegistrationPassword = (props: RegistrationPasswordProps) => {
	const [isValid, setIsValid] = useState<AccordionItemValidity>('initial');
	const [password, setPassword] = useState<string>('');
	const [passwordLabel, setPasswordLabel] = useState<string>(null);
	const [passwordLabelState, setPasswordLabelState] = useState<
		InputFieldLabelState
	>(null);
	const [
		passwordCriteriaValidation,
		setPasswordCriteriaValidation
	] = useState<passwordCriteria>();
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>(
		''
	);
	const [passwordConfirmationLabel, setPasswordConfirmationLabel] = useState<
		string
	>(null);
	const [
		passwordConfirmationLabelState,
		setPasswordConfirmationLabelState
	] = useState<InputFieldLabelState>(null);

	useEffect(() => {
		if (passwordCriteriaValidation) {
			const areAllCriteriaValid = Object.values(
				passwordCriteriaValidation
			).every((criteria) => criteria);

			if (password.length >= 1 && !areAllCriteriaValid) {
				setPasswordLabelState('invalid');
				setPasswordLabel(translate('registration.password.insecure'));
			} else if (password.length >= 1) {
				setPasswordLabelState('valid');
				setPasswordLabel(translate('registration.password.secure'));
			} else {
				setPasswordLabelState(null);
				setPasswordLabel(null);
			}
		}
	}, [passwordCriteriaValidation, password]);

	useEffect(() => {
		let passwordFits = inputValuesFit(passwordConfirmation, password);
		if (passwordConfirmation.length >= 1 && !passwordFits) {
			setPasswordConfirmationLabelState('invalid');
			setPasswordConfirmationLabel(
				translate('registration.password.notSame')
			);
		} else if (passwordConfirmation.length >= 1) {
			setPasswordConfirmationLabelState('valid');
			setPasswordConfirmationLabel(
				translate('registration.password.same')
			);
		} else {
			setPasswordConfirmationLabelState(null);
			setPasswordConfirmationLabel(null);
		}
	}, [passwordConfirmation, password]);

	useEffect(() => {
		props.onValidityChange(isValid);
	}, [isValid, props]);

	useEffect(() => {
		props.onPasswordChange(password);
	}, [password, props]);

	useEffect(() => {
		if (
			passwordLabelState === 'valid' &&
			passwordConfirmationLabelState === 'valid'
		) {
			setIsValid('valid');
		} else if (!passwordLabelState && !passwordConfirmationLabelState) {
			setIsValid('initial');
		} else {
			setIsValid('invalid');
		}
	}, [passwordLabelState, passwordConfirmationLabelState]);

	const inputItemPassword: InputFieldItem = {
		content: password,
		icon: <LockIcon />,
		id: 'passwordInput',
		label: passwordLabel
			? `${passwordLabel}`
			: translate('registration.password.input.label'),
		name: 'passwordInput',
		type: 'password',
		...(passwordLabelState && { labelState: passwordLabelState })
	};

	const inputItemPasswordConfirmation: InputFieldItem = {
		content: passwordConfirmation,
		icon: <LockIcon />,
		id: 'passwordConfirmation',
		label: passwordConfirmationLabel
			? `${passwordConfirmationLabel}`
			: translate('registration.password.confirmation.label'),
		name: 'passwordConfirmation',
		type: 'password',
		...(passwordConfirmationLabelState && {
			labelState: passwordConfirmationLabelState
		})
	};

	const handlepasswordChange = (event) => {
		setPasswordCriteriaValidation(
			validatePasswordCriteria(event.target.value)
		);
		setPassword(event.target.value);
	};

	const passwordCriteria = [
		{
			content: translate('registration.password.criteria.upperLowerCase'),
			isValidCondition: passwordCriteriaValidation?.hasUpperLowerCase
		},
		{
			content: translate('registration.password.criteria.number'),
			isValidCondition: passwordCriteriaValidation?.hasNumber
		},
		{
			content: translate('registration.password.criteria.specialChar'),
			isValidCondition: passwordCriteriaValidation?.hasSpecialChar
		},
		{
			content: translate('registration.password.criteria.length'),
			isValidCondition: passwordCriteriaValidation?.hasMinLength
		}
	];

	const passwordCriteriaList = passwordCriteria.map((criteria, index) => {
		return (
			<li
				key={index}
				className={`
					registrationPassword__validationItem 
					${
						criteria.isValidCondition
							? 'registrationPassword__validationItem--valid'
							: ''
					}
				`}
			>
				{criteria.content}
			</li>
		);
	});

	return (
		<div className="registrationPassword">
			<Text
				text={translate('registration.password.intro')}
				type="infoLargeAlternative"
			/>
			<ul className="registrationPassword__validation">
				{passwordCriteriaList}
			</ul>
			<InputField
				item={inputItemPassword}
				inputHandle={handlepasswordChange}
			/>
			<InputField
				item={inputItemPasswordConfirmation}
				inputHandle={(e) => setPasswordConfirmation(e.target.value)}
			/>
			{props.hasNoResetNote && (
				<div data-cy="no-password-reset-possible-note">
					<Text
						className="registrationPassword__note"
						text={translate('registration.password.note')}
						type="infoLargeAlternative"
						labelType={LABEL_TYPES.NOTICE}
					/>
				</div>
			)}
		</div>
	);
};
