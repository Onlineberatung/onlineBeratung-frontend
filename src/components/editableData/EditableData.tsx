import * as React from 'react';
import './editableData.styles';
import { Text } from '../text/Text';
import { translate } from '../../resources/scripts/i18n/translate';
import clsx from 'clsx';
import { ReactComponent as CrossMarkIcon } from '../../resources/img/icons/x.svg';
import { ReactComponent as PenIcon } from '../../resources/img/icons/pen.svg';
import { useEffect, useState } from 'react';

export interface EditableDataProps {
	label: string;
	initialValue?: string;
	isDisabled?: boolean;
	isSingleEdit?: boolean;
}

export const EditableData = (props: EditableDataProps) => {
	const inputFieldRef = React.useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState<string>();
	const [isDisabled, setIsDisabled] = useState<boolean>(props.isDisabled);
	const [isValid, setIsValid] = useState<boolean>(true);

	useEffect(() => {
		if (props.isSingleEdit) setIsDisabled(true);
	}, [props.isSingleEdit]);

	useEffect(() => {
		inputFieldRef.current.focus();
		inputFieldRef.current.select();
	}, [isDisabled]);

	const handleFocus = (event) => event.target.select();

	const handleInputValueChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		setIsValid(value.length > 0 ? true : false);
	};

	const handleRemoveButtonClick = () => {
		setInputValue('');
		setIsValid(false);
		inputFieldRef.current.focus();
	};

	const handleSingleEditButton = () => {
		setIsDisabled(false);
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
					'editableData__input--empty': !props.initialValue
				})}
				ref={inputFieldRef}
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
				disabled={isDisabled || !props.initialValue}
			/>
			{!isDisabled && props.initialValue && (
				<span
					className="editableData__inputButton editableData__inputButton--remove"
					onClick={handleRemoveButtonClick}
				>
					<CrossMarkIcon />
				</span>
			)}
			{props.isSingleEdit && isDisabled && (
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
