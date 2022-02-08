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
	MIN_USERNAME_LENGTH,
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from './registrationHelpers';
import { Text } from '../text/Text';

interface RegistrationUsernameProps {
	isUsernameAlreadyInUse: boolean;
	onUsernameChange: Function;
	onValidityChange: Function;
}

export const RegistrationUsername = ({
	isUsernameAlreadyInUse,
	onUsernameChange,
	onValidityChange
}: RegistrationUsernameProps) => {
	const [username, setUsername] = useState<string>('');
	const [isValid, setIsValid] =
		useState<AccordionItemValidity>(VALIDITY_INITIAL);
	const [labelContent, setLabelContent] = useState<string>(null);
	const [labelState, setLabelState] = useState<InputFieldLabelState>(null);

	useEffect(() => {
		if (isUsernameAlreadyInUse) {
			setIsValid(VALIDITY_INVALID);
			setLabelState(VALIDITY_INVALID);
			setLabelContent(translate('registration.user.unavailable'));
		}
	}, [isUsernameAlreadyInUse]);

	useEffect(() => {
		onUsernameChange(username);
	}, [username]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

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
			setIsValid(VALIDITY_VALID);
			setLabelState(VALIDITY_VALID);
			setLabelContent(translate('registration.user.suitable'));
		} else if (username.length > 0) {
			setIsValid(VALIDITY_INVALID);
			setLabelState(VALIDITY_INVALID);
			setLabelContent(translate('registration.user.unsuitable'));
		} else {
			setIsValid(VALIDITY_INITIAL);
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
