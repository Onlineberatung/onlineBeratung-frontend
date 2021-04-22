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
	onSingleEditActive?: Function;
}

export const EditableData = (props: EditableDataProps) => {
	const inputFieldRef = React.useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState<string>();
	const [isValid, setIsValid] = useState<boolean>(true);

	useEffect(() => {
		inputFieldRef.current.focus();
		inputFieldRef.current.select();
	}, [props.isDisabled]);

	const handleFocus = (event) => {
		event.target.select();
	};

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
		props.onSingleEditActive();
		if (!props.initialValue) {
			setInputValue('');
		}
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
						!props.initialValue && !inputValue
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
