import * as React from 'react';
import './editableData.styles';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import clsx from 'clsx';
import { ReactComponent as CrossMarkIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { useEffect, useState } from 'react';
import { InputFieldLabelState } from '../inputField/InputField';

export interface EditableDataProps {
	label: string;
	initialValue?: string;
	isDisabled?: boolean;
	isSingleEdit?: boolean;
	onSingleEditActive?: Function;
	validateCurrentValue?: Function;
	validity?: InputFieldLabelState;
}

export const EditableData = (props: EditableDataProps) => {
	const inputFieldRef = React.useRef<HTMLInputElement>(null);
	const getInitialValue = props.initialValue
		? props.initialValue
		: translate('profile.noContent');
	const [inputValue, setInputValue] = useState<string>();
	const [isValid, setIsValid] = useState<InputFieldLabelState>(
		props.validity ? props.validity : 'valid'
	);

	useEffect(() => {
		if (!props.isDisabled) {
			inputFieldRef.current.focus();
			inputFieldRef.current.select();
			inputFieldRef.current.value = !props.initialValue
				? ''
				: getInitialValue;
		} else if (props.isDisabled) {
			inputFieldRef.current.value = getInitialValue;
		}
	}, [props.isDisabled]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleFocus = (event) => {
		event.target.select();
	};

	const handleInputValueChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		if (props.validateCurrentValue) {
			props.validateCurrentValue(value);
		} else {
			setIsValid(value.length > 0 ? 'valid' : 'invalid');
		}
	};

	const handleRemoveButtonClick = () => {
		setInputValue('');
		setIsValid('invalid');
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
				<Text text={props.label} type="infoSmall" />
			</label>
			<input
				className={clsx('editableData__input', {
					'editableData__input--empty':
						!props.initialValue && props.isDisabled,
					'inputField__input--valid': props.validity === 'valid',
					'inputField__input--invalid': props.validity === 'invalid'
					//TODO: only validity on label?
				})}
				ref={inputFieldRef}
				type="text"
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
