import * as React from 'react';
import './editableData.styles';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import clsx from 'clsx';
import { ReactComponent as CrossMarkIcon } from '../../resources/img/icons/x.svg';
import { useState } from 'react';

export interface EditableDataProps {
	label: string;
	initialValue: string;
	isDisabled?: boolean;
}

export const EditableData = (props: EditableDataProps) => {
	const [inputValue, setInputValue] = useState<string>();
	const [isValid, setIsValid] = useState<boolean>(true);

	const handleFocus = (event) => event.target.select();

	const handleInputValueChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		setIsValid(value.length > 0 ? true : false);
	};

	const handleRemoveButtonClick = () => {
		setInputValue('');
		setIsValid(false);
	};

	return (
		<div
			className={clsx('editableData', {
				'editableData--active': !props.isDisabled && props.initialValue
			})}
		>
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
					'editableData__input--empty': !props.initialValue
				})}
				type="text"
				onFocus={handleFocus}
				id={props.label}
				name={props.label}
				defaultValue={
					props.initialValue
						? props.initialValue
						: translate('profile.noContent')
				}
				value={inputValue}
				onChange={handleInputValueChange}
				disabled={props.isDisabled || !props.initialValue}
			/>
			<span
				className="editableData__removeButton"
				onClick={handleRemoveButtonClick}
			>
				<CrossMarkIcon />
			</span>
		</div>
	);
};
