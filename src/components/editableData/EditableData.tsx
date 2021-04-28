import * as React from 'react';
import './editableData.styles';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import clsx from 'clsx';
import { ReactComponent as CrossMarkIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { useEffect, useState } from 'react';
import { isStringValidEmail } from '../registration/registrationHelpers';

export interface EditableDataProps {
	label: string;
	type: 'text' | 'email';
	initialValue?: string;
	isDisabled?: boolean;
	isSingleEdit?: boolean;
	onSingleEditActive?: Function;
	onValueIsValid?: Function;
	isEmailAlreadyInUse?: boolean;
}

export const EditableData = (props: EditableDataProps) => {
	const inputFieldRef = React.useRef<HTMLInputElement>(null);
	const getInitialValue = props.initialValue
		? props.initialValue
		: translate('profile.noContent');
	const [inputValue, setInputValue] = useState<string>();
	const [isValid, setIsValid] = useState<boolean>(true);
	const [label, setLabel] = useState<string>();

	useEffect(() => {
		if (!props.isDisabled) {
			inputFieldRef.current.value = !props.initialValue
				? ''
				: getInitialValue;
			inputFieldRef.current.focus();
			inputFieldRef.current.select();
		} else if (props.isDisabled) {
			inputFieldRef.current.value = getInitialValue;
			setIsValid(true);
			setLabel(props.label);
			setInputValue(props.initialValue);
		}
	}, [props.isDisabled]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (isValid && props.onValueIsValid) {
			props.onValueIsValid(inputValue);
		} else if (!isValid && props.onValueIsValid) {
			props.onValueIsValid(null);
		}
	}, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (props.isEmailAlreadyInUse) {
			setIsValid(false);
			setLabel(translate('furtherSteps.email.overlay.input.unavailable'));
		}
	}, [props.isEmailAlreadyInUse]);

	const handleFocus = (event) => {
		event.target.select();
	};

	const handleInputValueChange = (event) => {
		const value = event.target.value;
		setInputValue(value);

		if (props.type === 'email') {
			handleEmailValidation(value);
		} else {
			setIsValid(value.length > 0);
		}
	};

	const handleEmailValidation = (email) => {
		if (email.length > 0 && isStringValidEmail(email)) {
			setIsValid(true);
			setLabel(props.label);
		} else {
			setIsValid(false);
			setLabel(translate('furtherSteps.email.overlay.input.invalid'));
		}
	};

	const handleRemoveButtonClick = () => {
		setInputValue('');
		setIsValid(false);
		inputFieldRef.current.focus();
	};

	const handleSingleEditButton = () => {
		props.onSingleEditActive();
	};

	return (
		<div className="editableData">
			<label
				className={clsx({
					'editableData__label--invalid': !isValid
				})}
				htmlFor={props.label}
			>
				<Text text={label} type="infoSmall" />
			</label>
			<input
				className={clsx('editableData__input', {
					'editableData__input--empty':
						!props.initialValue && props.isDisabled
				})}
				ref={inputFieldRef}
				type={props.type}
				onFocus={handleFocus}
				id={props.label}
				name={props.label}
				value={inputValue}
				onChange={handleInputValueChange}
				disabled={props.isDisabled}
			/>
			{!props.isDisabled && (
				<span
					className="editableData__inputButton editableData__inputButton--remove"
					onClick={handleRemoveButtonClick}
				>
					<CrossMarkIcon />
				</span>
			)}
			{props.isSingleEdit && props.isDisabled && (
				<span
					className="editableData__inputButton editableData__inputButton--singleEdit"
					onClick={handleSingleEditButton}
				>
					<PenIcon />
				</span>
			)}
		</div>
	);
};
