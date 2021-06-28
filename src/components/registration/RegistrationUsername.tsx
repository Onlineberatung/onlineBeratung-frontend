import * as React from 'react';
import { useEffect, useState } from 'react';
import { translate } from '../../utils/translate';
import {
	InputField,
	InputFieldItem,
	InputFieldLabelState
} from '../inputField/InputField';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';
import {
	AccordionItemValidity,
	MIN_USERNAME_LENGTH
} from './registrationHelpers';
import { Text } from '../text/Text';

interface RegistrationUsernameProps {
	isUsernameAlreadyInUse: boolean;
	onUsernameChange: Function;
	onValidityChange: Function;
}

export const RegistrationUsername = (props: RegistrationUsernameProps) => {
	const [username, setUsername] = useState<string>('');
	const [isValid, setIsValid] = useState<AccordionItemValidity>('initial');
	const [labelContent, setLabelContent] = useState<string>(null);
	const [labelState, setLabelState] = useState<InputFieldLabelState>(null);

	useEffect(() => {
		if (props.isUsernameAlreadyInUse) {
			setIsValid('invalid');
			setLabelState('invalid');
			setLabelContent(translate('registration.user.unavailable'));
		}
	}, [props.isUsernameAlreadyInUse]);

	useEffect(() => {
		props.onUsernameChange(username);
	}, [username, props]);

	useEffect(() => {
		props.onValidityChange(isValid);
	}, [isValid, props]);

	const inputItemUsername: InputFieldItem = {
		content: username,
		icon: <PersonIcon />,
		id: 'username',
		label: labelContent
			? `${labelContent}`
			: translate('registration.user.label'),
		maxLength: 30,
		name: 'username',
		type: 'text',
		...(labelState && { labelState: labelState })
	};

	const handleUsernameChange = (event) => {
		validateUsername(event.target.value);
		setUsername(event.target.value);
	};

	const validateUsername = (username) => {
		if (username.length >= MIN_USERNAME_LENGTH) {
			setIsValid('valid');
			setLabelState('valid');
			setLabelContent(translate('registration.user.suitable'));
		} else if (username.length > 0) {
			setIsValid('invalid');
			setLabelState('invalid');
			setLabelContent(translate('registration.user.unsuitable'));
		} else {
			setIsValid('initial');
			setLabelState(null);
			setLabelContent(null);
		}
	};

	return (
		<div>
			<Text
				text={translate('registration.user.infoText')}
				type="infoLargeAlternative"
			/>
			<InputField
				item={inputItemUsername}
				inputHandle={handleUsernameChange}
			/>
		</div>
	);
};
