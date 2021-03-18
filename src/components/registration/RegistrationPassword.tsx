import * as React from 'react';
import { useEffect, useState } from 'react';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as LockIcon } from '../../resources/img/icons/lock.svg';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import {
	inputValuesFit,
	strengthIndicator
} from '../../resources/scripts/helpers/validateInputValue';
import { AccordionItemValidity } from './registrationHelpers';

interface RegistrationPasswordProps {
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
		if (
			passwordLabelState === 'valid' &&
			passwordConfirmationLabelState === 'valid'
		) {
			setIsValid('valid');
		} else {
			setIsValid('initial');
		}
	}, [passwordLabelState, passwordConfirmationLabelState]);

	useEffect(() => {
		props.onValidityChange(isValid);
	}, [isValid, props]);

	useEffect(() => {
		props.onPasswordChange(password);
	}, [password, props]);

	const inputItemPassword: InputFieldItem = {
		content: password,
		icon: <LockIcon />,
		id: 'passwordInput',
		label: passwordLabel
			? `${passwordLabel}`
			: translate('registration.user.label'),
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
		validatePassword(event.target.value);
		validatePasswordConfirmation(passwordConfirmation, event.target.value);
		setPassword(event.target.value);
	};

	const handlePasswordConfirmationChange = (event) => {
		validatePasswordConfirmation(event.target.value, password);
		setPasswordConfirmation(event.target.value);
	};

	const validatePassword = (password: string) => {
		let passwordStrength = strengthIndicator(password);
		if (password.length >= 1 && passwordStrength < 4) {
			setPasswordLabelState('invalid');
			setPasswordLabel(translate('registration.password.insecure'));
		} else if (password.length >= 1) {
			setPasswordLabelState('valid');
			setPasswordLabel(translate('registration.password.secure'));
		} else {
			setPasswordLabelState(null);
			setPasswordLabel(null);
		}
	};

	const validatePasswordConfirmation = (
		confirmPassword: string,
		password: string
	) => {
		let passwordFits = inputValuesFit(confirmPassword, password);
		if (confirmPassword.length >= 1 && !passwordFits) {
			setPasswordConfirmationLabelState('invalid');
			setPasswordConfirmationLabel(
				translate('registration.password.notSame')
			);
		} else if (confirmPassword.length >= 1) {
			setPasswordConfirmationLabelState('valid');
			setPasswordConfirmationLabel(
				translate('registration.password.same')
			);
		} else {
			setPasswordConfirmationLabelState(null);
			setPasswordConfirmationLabel(null);
		}
	};

	return (
		<div>
			<Text
				text={translate('registration.password.intro')}
				type="infoLargeAlternative"
			/>
			<InputField
				item={inputItemPassword}
				inputHandle={handlepasswordChange}
			/>
			<InputField
				item={inputItemPasswordConfirmation}
				inputHandle={handlePasswordConfirmationChange}
			/>
		</div>
	);
};
