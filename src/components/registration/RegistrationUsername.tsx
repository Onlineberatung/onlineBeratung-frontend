import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {
	AccordionItemValidity,
	isStringValidUsername,
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from './registrationHelpers';
import { Text } from '../text/Text';
import { useTranslation } from 'react-i18next';

interface RegistrationUsernameProps {
	isUsernameAlreadyInUse: boolean;
	onUsernameChange: Function;
	onValidityChange: Function;
	onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

export const RegistrationUsername = ({
	isUsernameAlreadyInUse,
	onUsernameChange,
	onValidityChange,
	onKeyDown
}: RegistrationUsernameProps) => {
	const { t: translate } = useTranslation();
	const [username, setUsername] = useState<string>('');
	const [isValid, setIsValid] =
		useState<AccordionItemValidity>(VALIDITY_INITIAL);
	const [labelContent, setLabelContent] = useState<string>(null);

	useEffect(() => {
		if (isUsernameAlreadyInUse) {
			setIsValid(VALIDITY_INVALID);
			setLabelContent(translate('registration.user.unavailable'));
		}
	}, [isUsernameAlreadyInUse, translate]);

	useEffect(() => {
		onUsernameChange(username);
	}, [username]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleUsernameChange = (event) => {
		validateUsername(event.target.value);
		setUsername(event.target.value);
	};

	const validateUsername = (username) => {
		if (isStringValidUsername(username)) {
			setIsValid(VALIDITY_VALID);
			setLabelContent(translate('registration.user.suitable'));
		} else if (username.length === 0) {
			setIsValid(VALIDITY_INITIAL);
			setLabelContent(null);
		} else {
			setIsValid(VALIDITY_INVALID);
			setLabelContent(translate('registration.user.unsuitable'));
		}
	};

	const getHelperText = () => {
		if (labelContent) {
			return labelContent;
		}
		return '';
	};

	return (
		<div>
			<Text
				text={translate('registration.user.infoText')}
				type="standard"
				className="text__registration_user"
			/>
			<TextField
				id="username"
				name="username"
				label={translate('registration.user.label')}
				value={username}
				onChange={handleUsernameChange}
				onKeyDown={onKeyDown}
				error={isValid === VALIDITY_INVALID}
				helperText={getHelperText()}
				fullWidth
				variant="outlined"
				autoComplete="off"
				inputProps={{ maxLength: 30 }}
				sx={{ mt: 2 }}
			/>
		</div>
	);
};
