import * as React from 'react';
import { useState } from 'react';
import './registrationUsername.styles';
import { translate } from '../../resources/scripts/i18n/translate';
import { InputField, InputFieldItem } from '../inputField/InputField';
import { ReactComponent as PersonIcon } from '../../resources/img/icons/person.svg';

export const RegistrationUsername = () => {
	const [username, setUsername] = useState('');

	const inputItemUsername: InputFieldItem = {
		content: username,
		// class: getValidationClassNames(
		// 	!!usernameErrorMessage,
		// 	!!usernameSuccessMessage
		// ),
		icon: <PersonIcon />,
		id: 'username',
		// label:
		// 	usernameErrorMessage || usernameSuccessMessage
		// 		? `${usernameErrorMessage} ${usernameSuccessMessage}`
		// 		: translate('registration.user.label'),
		label: translate('registration.user.label'),
		infoText: translate('registration.user.infoText'),
		maxLength: 30,
		name: 'username',
		type: 'text'
	};

	const handleUsernameChange = (event) => {
		// validateUsername(event.target.value);
		console.log('change user name');
		setUsername(event.target.value);
	};

	return (
		<div>
			<InputField
				item={inputItemUsername}
				inputHandle={handleUsernameChange}
			/>
		</div>
	);
};
