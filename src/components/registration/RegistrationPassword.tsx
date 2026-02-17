import * as React from 'react';
import { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import LockIcon from '../../resources/img/icons/lock.svg?react';
import { LABEL_TYPES, Text } from '../text/Text';
import {
	inputValuesFit,
	passwordCriteria,
	validatePasswordCriteria
} from '../../utils/validateInputValue';
import {
	AccordionItemValidity,
	VALIDITY_INITIAL,
	VALIDITY_INVALID,
	VALIDITY_VALID
} from './registrationHelpers';
import './registrationPassword.styles.scss';
import { useTranslation } from 'react-i18next';

interface RegistrationPasswordProps {
	onPasswordChange: Function;
	onValidityChange: Function;
	passwordNote: string;
	onKeyDown?: Function;
}

export const RegistrationPassword = ({
	onPasswordChange,
	onValidityChange,
	passwordNote,
	onKeyDown
}: RegistrationPasswordProps) => {
	const { t: translate } = useTranslation();
	const [isValid, setIsValid] =
		useState<AccordionItemValidity>(VALIDITY_INITIAL);
	const [password, setPassword] = useState<string>('');
	const [passwordLabel, setPasswordLabel] = useState<string>(null);
	const [passwordCriteriaValidation, setPasswordCriteriaValidation] =
		useState<passwordCriteria>();
	const [passwordConfirmation, setPasswordConfirmation] =
		useState<string>('');
	const [passwordConfirmationLabel, setPasswordConfirmationLabel] =
		useState<string>(null);

	useEffect(() => {
		if (passwordCriteriaValidation) {
			const areAllCriteriaValid = Object.values(
				passwordCriteriaValidation
			).every((criteria) => criteria);

			if (password.length >= 1 && !areAllCriteriaValid) {
				setPasswordLabel(translate('registration.password.insecure'));
			} else if (password.length >= 1) {
				setPasswordLabel(translate('registration.password.secure'));
			} else {
				setPasswordLabel(null);
			}
		}
	}, [passwordCriteriaValidation, password, translate]);

	useEffect(() => {
		let passwordFits = inputValuesFit(passwordConfirmation, password);
		if (passwordConfirmation.length >= 1 && !passwordFits) {
			setPasswordConfirmationLabel(
				translate('registration.password.notSame')
			);
		} else if (passwordConfirmation.length >= 1) {
			setPasswordConfirmationLabel(
				translate('registration.password.same')
			);
		} else {
			setPasswordConfirmationLabel(null);
		}
	}, [passwordConfirmation, password, translate]);

	useEffect(() => {
		onValidityChange(isValid);
	}, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		onPasswordChange(password);
	}, [password]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const areAllCriteriaValid = passwordCriteriaValidation && Object.values(
			passwordCriteriaValidation
		).every((criteria) => criteria);
		
		const passwordFits = inputValuesFit(passwordConfirmation, password);
		
		if (password.length >= 1 && areAllCriteriaValid && passwordConfirmation.length >= 1 && passwordFits) {
			setIsValid(VALIDITY_VALID);
		} else if (!password && !passwordConfirmation) {
			setIsValid(VALIDITY_INITIAL);
		} else {
			setIsValid(VALIDITY_INVALID);
		}
	}, [password, passwordConfirmation, passwordCriteriaValidation]);

	const handlepasswordChange = (event) => {
		setPasswordCriteriaValidation(
			validatePasswordCriteria(event.target.value)
		);
		setPassword(event.target.value);
	};

	const getPasswordHelperText = () => {
		if (passwordLabel) {
			return passwordLabel;
		}
		return '';
	};

	const getPasswordConfirmationHelperText = () => {
		if (passwordConfirmationLabel) {
			return passwordConfirmationLabel;
		}
		return '';
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
				title={
					criteria.isValidCondition
						? translate('registration.password.criteria.fulfilled')
						: ''
				}
				aria-label={
					criteria.isValidCondition
						? translate('registration.password.criteria.fulfilled')
						: ''
				}
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

	const isPasswordInvalid = password.length >= 1 && passwordLabel === translate('registration.password.insecure');
	const isPasswordConfirmationInvalid = passwordConfirmation.length >= 1 && passwordConfirmationLabel === translate('registration.password.notSame');

	return (
		<div className="registrationPassword">
			<Text
				text={translate('registration.password.intro')}
				type="standard"
			/>
			<ul className="registrationPassword__validation">
				{passwordCriteriaList}
			</ul>
			<TextField
				id="passwordInput"
				name="passwordInput"
				label={translate('registration.password.input.label')}
				type="password"
				value={password}
				onChange={handlepasswordChange}
				onKeyDown={(e) => onKeyDown(e, false)}
				error={isPasswordInvalid}
				helperText={getPasswordHelperText()}
				fullWidth
				variant="outlined"
				autoComplete="new-password"
				sx={{ mt: 2 }}
			/>
			<TextField
				id="passwordConfirmation"
				name="passwordConfirmation"
				label={translate('registration.password.confirmation.label')}
				type="password"
				value={passwordConfirmation}
				onChange={(e) => setPasswordConfirmation(e.target.value)}
				onKeyDown={(e) => onKeyDown(e, true, false)}
				error={isPasswordConfirmationInvalid}
				helperText={getPasswordConfirmationHelperText()}
				fullWidth
				variant="outlined"
				autoComplete="new-password"
				sx={{ mt: 2 }}
			/>
			{passwordNote && (
				<div data-cy="registration-password-note">
					<Text
						className="registrationPassword__note"
						text={passwordNote}
						type="infoLargeAlternative"
						labelType={LABEL_TYPES.NOTICE}
					/>
				</div>
			)}
		</div>
	);
};
